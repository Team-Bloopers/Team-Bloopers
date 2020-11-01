const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth2 = async (req,res,next)=>{
    // console.log('auth middleware')
    // next()
    try {
        const token = req.cookies.Token
        const decoded = jwt.verify(token, process.env.JWT)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        console.log(req.body)
       
        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send('Authentication error')
    }
}

module.exports = auth2