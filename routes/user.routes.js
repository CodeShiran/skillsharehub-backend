import express from 'express'
import { getloggedUser, registerUser, updateUser, userLogin } from '../controller/user.controller'
export const userRouter = express.Router()
import { Protect } from '../middleware/auth.middleware.js'

userRouter.post('/register', registerUser)

userRouter.post("/login",  userLogin)

userRouter.get("/me", Protect, getloggedUser)

userRouter.put("/me", Protect, updateUser);





