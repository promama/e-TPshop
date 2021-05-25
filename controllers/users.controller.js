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
    await mongoose.connect(process.env.DB_CONNECTION_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
    });
    
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
    .catch(err => {
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
        }
    } catch {
        res.json({
            success: false
        })
    }

    if(checking = await bcrypt.compare(req.body.password, user[0].password)) {
        res.json({
            success: true,
            message: "user authorized"
        })
    } else {
        res.json({
            success: false,
            message: "user not authorized"
        })
    }

    //create token
    const target = { name: user.username, role: user.privilege, status: user.status }

    const access_token = jwt.sign(target, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "60s" })
    console.log(access_token)
}

//not finished
module.exports.postUpdate = async (req, res) => {
    const user = await User.find({ username: req.body.username }).exec()

    //username from body
    console.log(req.body.username)
    //time token created
    console.log(req.user)

    if(user.length == 0) {
        console.log('no user founded')

        res.json({
            message: "fail to update user"
        })
    } else {
        console.log(`found ${user.length} user`)
        console.log(user)
      
        res.json({
            message: "success"
        })
    }
}