import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SkillSession',
        required: true
    },
    learner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookedAt: {
        type: Date,
        default: Date.now
    }
})

export const Booking = mongoose.model('Booking', bookingSchema)