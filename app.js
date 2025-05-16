import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { User } from './model/user.model.js'

const app = express()
dotenv.config()



app.get('/', (req, res) => {
    res.send('hi shiran')
})

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('mongodb connected')
    app.listen(3000, () => {
    console.log('server is running on 3000')
})
})
.catch((err) => console.log(err))

app.post('/api/users/register', async(req, res) => {
    try {
        const user = User.create(req.body)
        res.status(201).json({message: 'user created successfully'})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})