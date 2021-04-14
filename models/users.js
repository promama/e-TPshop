const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    status: String,     //active, suspen, banned,...
    privilege: String,
    facebookId: String,
    phone: Number
})

var User = mongoose.model("Users", userSchema, "users")
module.exports = User