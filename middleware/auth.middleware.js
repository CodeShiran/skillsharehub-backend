import jwt from 'jsonwebtoken'
import { User } from '../model/user.model.js'

export const Protect = async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select('-password')

            if(!req.user) return res.status(400).json({message: 'user not found'})

            next()

        } catch (error) {
            res.status(404).json({message: 'not authorized token failed'})
        }
    }

    if(!token) {
        res.status(401).json({message: 'not authorized no token'})
    }
}




