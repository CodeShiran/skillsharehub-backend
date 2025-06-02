import express from 'express'
import { Protect } from '../middleware/auth.middleware.js'
import { createSession, getLoggedUserSession, getSessions, instructorUpdatesSession } from '../controller/session.controller.js';
export const sessionRoute = express.Router()


sessionRoute.post("/", Protect, createSession);

sessionRoute.get('/', Protect, getSessions)

sessionRoute.get('/me', Protect, getLoggedUserSession)

sessionRoute.get('/:id', Protect, getSessions)

sessionRoute.put('/api/sessions/:id', Protect, instructorUpdatesSession)

sessionRoute.delete('/:id', Protect, instructorUpdatesSession)





