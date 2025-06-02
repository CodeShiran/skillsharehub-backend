import { SkillSession } from "./model/skillSession.model.js";

export const createBooking = async(req, res) => {
  try {

    if(req.user.role !== 'learner') return res.status(403).json({message: 'only users can create bookings'})

    const {sessionId} = req.params

    const session = await SkillSession.findById(sessionId)

    if(!session) return res.status(404).json({message: 'session not found'})

    const alreadyBooked = session.bookings.includes(req.user._id)
    if(alreadyBooked) return res.status(400).json({message: 'user has already booked the session'})

    session.bookings.push(req.user._id)
    await session.save()

    res.status(201).json({message: 'booking created successfully'})
    
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'server error'})
  }
}

export const getBookingDetails = async(req, res) => {
  try {
    if(req.user.role !== 'learner') return res.status(403).json({message: 'only learners can get users'})

    const booking = await SkillSession.find({bookings: req.user._id})
    .populate('instructor', 'name email');

    res.status(200).json({booking})
    
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'server error'})
  }
}