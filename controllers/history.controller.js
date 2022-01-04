var User = require("../models/users")
var Cart = require("../models/carts")
var Product = require("../models/products")
var History = require("../models/historys")
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')
var auth = require("../controllers/auth.controller")
var user = require("../controllers/users.controller")
const { json } = require("body-parser")

//show all history carts of a user
module.exports.getCartBought = async (req, res) => {
    const authHeader = req.headers['authorization']
    //check if it have authHeader => token = undefined or token
    const token = authHeader && authHeader.split(' ')[1]

    //taking user id from token 
    var userId = await auth.decrypt(token)
    console.log("user id: %j", userId._id)

    var history = await History.find({ userId: userId._id }).select("-_id -__v -userId -products._id")

    res.json({
        data: history
    })
}