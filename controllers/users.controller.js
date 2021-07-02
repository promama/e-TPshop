require('dotenv').config()

const User = require("../models/users")
const Cart = require("../models/carts")
const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const authController = require('./auth.controller')

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
module.exports.getallUser = (req, res) => {
    User.find()
    .exec()
    .then(users => {
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
    })
    .catch( err => {
        res.json({
            success: false,
            message: err
        })
    })
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

        const access_token = jwt.sign({ username: req.body.username, _id: user[0]._id }, process.env.ACCESS_TOKEN_SECRET)//, { expiresIn: "300s" })
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