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
module.exports.getallUser = async(req, res) => {
    //find all accounts created
    const allUser = await User.find()

    //check and return result founded
    try {
        //check if can find anything
        if(allUser.length) {
            res.json({
                success: true,
                data: { allUser }
            })
        }
        //fail to find anyone
        else {
            res.json({
                success: false,
                data: "can't find any user"
            })
        }
    } catch {
        res.json({
            err_location: "users.controller.js",
            err_posistion: "getallUser",
            id: "check and return result founded"
        })
    }
}

// //not completed
// module.exports.getUser = async(req, res) => {
//     const { email, username } = req.body
//     const account_username = await User.find({ username }).exec()
//     const account_email = await User.find({ email }).exec()

//     if(account_username) {
//         res.json({
//             success: true,
//             data: { account_email }
//         })
//     } else if (account_email) {
//         res.json({
//             success: true,
//             data: { account_username }
//         })
//     } else {
//         res.json({
//             success: false,
//             data: "no account have username or email given"
//         })
//     }
// }