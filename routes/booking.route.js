import express from 'express'
import { Protect } from '../middleware/auth.middleware.js'
import { createBooking, getBookingDetails } from '../controller/booking.controller.js'

export const bookingRoute = express.Router()

bookingRoute.post('/:sessionId', Protect, createBooking)

app.get('/', Protect, getBookingDetails)
