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
        next()
    })
}

module.exports.roleCheck = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    //check if it have authHeader => token = undefined or token
    const token = authHeader && authHeader.split(' ')[1]

    user = await this.decrypt(token)
    console.log(user)

    if (user.role == "user") {
        return res.json({
            message: "no author"
        })
    } else if (user.role == "shop" || user.role == "admin") {
        req.mid.role = user.role
        next()
    } else {
        return res.json({
            message: "no role"
        })
    }
}

module.exports.decrypt = async (token) => {
    // return "aaas"
    user = await jwt.decode(token, process.env.ACCESS_TOKEN_SECRET)
    console.log(token)
    
    return { _id: user._id, role: user.role }
}

module.exports.checkingRole = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    //check if it have authHeader => token = undefined or token
    const token = authHeader && authHeader.split(' ')[1]

    user = await this.decrypt(token)
    console.log(user)

    if (user.role == "user") {
        req.mid.role = user.role
        req.mid._id = user._id
        next()
    } else if (user.role == "shop" || user.role == "admin") {
        req.mid.role = user.role
        req.mid._id = user._id
        next()
    } else {
        return res.json({
            message: "no authorize"
        })
    }
}

module.exports.checkAdmin = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    //check if it have authHeader => token = undefined or token
    const token = authHeader && authHeader.split(' ')[1]

    user = await this.decrypt(token)
    console.log(user)

    if (user.role == "admin") {
        next()
    } else {
        return res.json({
            message: "no authorize"
        })
    }
}