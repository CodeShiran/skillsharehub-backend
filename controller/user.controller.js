import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const registerUser = async (req, res) => {
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
}

export const userLogin = async (req, res) => {
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
} 

export const getloggedUser = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
}

export const updateUser = async (req, res) => {
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
}
