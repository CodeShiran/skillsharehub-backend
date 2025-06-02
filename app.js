import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "./model/user.model.js";
import jwt from "jsonwebtoken";
import { Protect } from "./middleware/auth.middleware.js";
import { SkillSession } from "./model/skillSession.model.js";
import { Booking } from "./model/booking.model.js";
import { userRouter } from "./routes/user.routes.js";
import { sessionRoute } from "./routes/session.route.js";
import { bookingRoute } from "./routes/booking.route.js";

const app = express();
app.use(express.json());
app.use('/api/users', userRouter)
app.use('/api/session', sessionRoute)
app.use('/api/booking', bookingRoute)
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


























