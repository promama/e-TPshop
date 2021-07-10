require('dotenv').config()

const User = require("../models/users")
const Cart = require("../models/carts")
const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library')

const client = new OAuth2Client("597253275414-4a1k1im1uha1jgrvr3ai6ckeriffh1f6.apps.googleusercontent.com")

const auth = require('./auth.controller')

//create account
module.exports.postRegister = (req, res) => {
    User
        .find({ username: req.body.username })
        .exec()
        .then(user => {
            if(user.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "username is existed"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hashed) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            password: hashed
                        })

                        const cart = new Cart({
                            _id: new mongoose.Types.ObjectId(),
                            userId: user._id
                        })
            
                        user
                            .save()
                            .then(result => {
                                console.log(result)
                                res.status(201).json({
                                    success: true,
                                    message: 'create user success!'
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    success: false,
                                    message: err
                                })
                            })

                        cart
                            .save()
                            .then(result => {
                                console.log(result)
                            })
                    }
                })
            }
        })
}

module.exports.deleteUser = (req, res) => {
    User.remove({ _id: req.params.id })
        .exec()
        .then(result => {
            res.status(200).json({
                success: true,
                message: "user is deleted"
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: err
            })
        })
}

//find all accounts
module.exports.getallUser = async (req, res) => {
    const authHeader = req.headers['authorization']
    //check if it have authHeader => token = undefined or token
    const token = authHeader && authHeader.split(' ')[1]

    var userId = new Object({ _id: '' })

    //console.log(token)
    if (token != null) {
        userId = await auth.decrypt(token)
    }

    if (userId._id && userId._id != '') {
        var user = await User.find({ _id: userId._id })
        res.json({
            success: true,
            data: user
        })
    } else {
        try {
            var users = await User.find()
            if(users.length == 0) {
                res.json({
                    success: false,
                    message: "can't find any user"
                })
            } else {
                res.json({
                    success: true,
                    data: users
                })
            }
        } catch (err) {
            res.json({
                success: false,
                message: err
            })
        }
        
    }
}

module.exports.postlogin = async (req, res) => {
    const user = await User.find({ username: req.body.username }).exec()

    try {
        if(user.length == 0) {
            console.log("no user founded")
        } else {
            console.log(`found ${user.length} user`)
            //console.log(user)
        }
    } catch {
        res.json({
            success: false
        })
    }

    //console.log(user)

    if(checking = await bcrypt.compare(req.body.password, user[0].password)) {
        //create token)
        
        console.log(user)

        const access_token = await jwt.sign({ username: req.body.username, _id: user[0]._id, role: user[0].role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "300s" })
        console.log(access_token)

        res.json({
            success: true,
            access_token: access_token
        })
    } else {
        res.json({
            success: false,
            message: "error"
        })
    }
}

//not finished
module.exports.postUpdate = async (req, res) => {
    const user = await User.find({ username: req.body.username }).exec()

    //username from body
    console.log(req.body.username)

    if(user.length == 0) {
        console.log('no user founded')

        res.json({
            message: "fail to update user, no user founded"
        })
    } else {
        console.log(`found ${user.length} user`)
        console.log(user)
      
        const filter = { username: req.body.username}

        console.log(filter)

        var update = { }

        if (req.body.password) {
            await bcrypt.hash(req.body.password, 10).then((hashed) => {
                const source = { password: hashed }
                console.log(source)
                Object.assign(update, source)
            })
        }

        if (req.body.status) {
            const source = { status: req.body.status }
            Object.assign(update, source)
        }
        if (req.body.privilege) {
            const source = { privilege: req.body.privilege }
            Object.assign(update, source)
        }
        

        console.log(req.body.password)

        console.log(update)

        const a = await User.findOneAndUpdate(filter, update).exec()

        console.log(a)

        res.json({
            success: true,
            message: "update successed"
        })
    }
}

module.exports.postLoginGoogle = async (req, res) => {
    const tokenId = req.body.tokenId

    response = await client.verifyIdToken({ idToken: tokenId, audience: "597253275414-4a1k1im1uha1jgrvr3ai6ckeriffh1f6.apps.googleusercontent.com" })
    console.log(response.payload)

    if (response.payload.email_verified) {
        console.log("verified")
        const user = await User.findOne({ email: response.payload.email })
        console.log(user)

        if (user) {
            console.log("vo if")

            const token = await jwt.sign({ _id: user._id, role: user.role, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "300s" })

            res.json({
                token
            })
        } else {
            console.log("vo else")

            const newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                email: response.payload.email,
                username: response.payload.email,
                password: "a"
            })

            const cart = new Cart({
                _id: new mongoose.Types.ObjectId(),
                userId: newUser._id
            })

            const token = await jwt.sign({ _id: newUser._id, role: newUser.role, username: newUser.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "300s" })

            await newUser.save()
            await cart.save()

            res.json({
                token
            })
        }
    } else {
        console.log("not verified")
        res.json({
            success: false,
            message: "google not authorize"
        })
    }
}