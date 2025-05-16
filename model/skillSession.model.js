import mongoose from "mongoose";

const skillSessionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
    },
    date: {
        type: Date,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

export const SkillSession = mongoose.model('SkillSession', skillSessionSchema)