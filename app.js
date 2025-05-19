import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "./model/user.model.js";
import jwt from "jsonwebtoken";
import { Protect } from "./middleware/auth.middleware.js";
import { SkillSession } from "./model/skillSession.model.js";

const app = express();
app.use(express.json());
dotenv.config();

app.get("/", (req, res) => {
  res.send("hi shiran");
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("mongodb connected");
    app.listen(3000, () => {
      console.log("server is running on 3000");
    });
  })
  .catch((err) => console.log(err));

app.post("/api/users/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "existing user" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userInfo } = newUser.toObject();

    res.status(201).json({
      message: "user created successfully",
      token,
      user: userInfo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userInfo } = user.toObject();

    res.status(200).json({
      message: "login success",
      token,
      user: userInfo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/users/me", Protect, async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

app.put("/api/users/me", Protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "user not found" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();
    const { password, ...userWithoutPassword } = updatedUser._doc;
    res.status(200).json({
      message: "successfully updated the user",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});

app.post("/api/sessions", Protect, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "instructor")
      return res
        .status(403)
        .json({ message: "you are not authorized to create a new session" });

    const { title, description, category, date } =
      req.body;

    if (!title || !description || !category)
      return res.status(400).json({ message: "required feilds are missing" });

    const session = new SkillSession({
      title,
      description,
      category,
      date,
      instructor: user._id,
      bookings: [],
    });

    await session.save();

    res
      .status(201)
      .json({ message: "session created successfully", data: session });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});


app.get('/api/sessions', Protect, async(req, res) => {
  
  try {
    const session = await SkillSession.find()
    .populate('instructor', 'name email')
    .sort({date: 1})

    res.status(200).json(session)
    
  } catch (error) {
    console.error(error)
    res.status(401).json({message: 'server error'})
  }

})

app.get('/api/sessions/:id', Protect, async(req, res) => {
  try {
    const {id} = req.params

  const session = await SkillSession.findById(id)
  .populate('instructor', 'name email')

  if(!session) return res.status(404).json({message: 'session not found'})

  res.status(200).json(session)
  } catch (error) {
    console.error(error)

    if(error.kind === 'objectId') {
      return res.status(400).json({message: 'invalid session id'})
    }

    res.status(500).json({message: 'server not found'})
  }
})

