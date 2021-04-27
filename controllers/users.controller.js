var User = require("../models/users")
var Cart = require("../models/carts")
const mongoose = require("mongoose")
const bcrypt = require('bcrypt')

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
module.exports.getallUser = (req, res) => {
    User
        .find()
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
            console.log(user.length)
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
}