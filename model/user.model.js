import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['instructor', 'learner'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export const User = mongoose.model("User", userSchema)