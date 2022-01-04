var User = require("../models/users")
var Cart = require("../models/carts")
var Product = require("../models/products")
var History = require("../models/historys")
var Income = require("../models/incomes")
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')
var auth = require("../controllers/auth.controller")
var user = require("../controllers/users.controller")
const { json } = require("body-parser")

//get all income
module.exports.getIncome = async (req, res) => {
    var income = await Income.find().select("-_id -__v").sort({ year: "asc", month: "asc" })

    console.log(income)

    res.json({
        data: income
    })
}