require('dotenv').config()

const jwt = require('jsonwebtoken')

//verify token
module.exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    //check if it have authHeader => token = undefined or token
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null) {
        return res.json({
            message: "no token found"
        })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {
            return res.json({
                message: "token is no longer valid"
            })
        }

        req.user = user
    })
    next()
}