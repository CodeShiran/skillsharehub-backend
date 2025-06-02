import { SkillSession } from "./model/skillSession.model.js";


export const createSession = async (req, res) => {
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
}

export const getSessions = async(req, res) => {
  
  try {
    const session = await SkillSession.find()
    .populate('instructor', 'name email')
    .sort({date: 1})

    res.status(200).json(session)
    
  } catch (error) {
    console.error(error)
    res.status(401).json({message: 'server error'})
  }

}

export const getLoggedUserSession = async(req, res) => {
  try {
    const userId = req.user._id
    const role = req.user.role

    let session

    if(role === 'instructor') {
      session = await SkillSession.find({instructor: userId}).populate('instructor', 'name email')
    }
    else {
      session = await SkillSession.find({bookings: userId}).populate('instructor','name email')
    }

    res.status(200).json({session})
    
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'server error'})
  }
}

export const getSession = async(req, res) => {
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
}

export const instructorUpdatesSession = async(req, res) => {
  try {
    const sessionId = req.params.id

  if(req.user.role !== 'instructor') return res.status(403).json({message: 'only instructors can update sessions'})

  const session = await SkillSession.findById(sessionId)

  if(!session) return res.send(404).json({message: 'session not found'})

  if(session.instructor.toString() !== req.user.id.toString()) return res.status(403).json({message: 'you are not authorized to update this session'})

  const feildsToUpdate = ['title', 'description', 'category', 'date']

  feildsToUpdate.forEach(feild => {
    if(req.body[feild] !== undefined) session[feild] = req.body[feild] 
  })

  const updatedSession = await session.save()

  res.status(200).json(updatedSession)
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'server errror'})
  }
}

export const instructorUpdateSession = async(req, res) => {
  try {
    const sessionId = req.params.id

    if(req.user.role !== 'instructor') return res.status(403).json({message: 'only instructor can update session'})

    const session = await SkillSession.findById(sessionId)

    if(!session) return res.status(403).json({message: 'session not found'})

    if(session.instructor.toString() !== req.user.id.toString()) return res.status(403).json({message: 'you are not authorized to delete this session'})

    await session.deleteOne()

    res.status(200).json({message: 'session deleted successfully'})

    
  } catch (error) {
    console.error(error)

    res.status(500).json({message: 'server error'})
  }
}