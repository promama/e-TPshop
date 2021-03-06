const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    email: {
        type: String, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, required: true, default: "active" },     //active, suspen, banned,...
    privilege: { type: String, required: true, default: "common" },
    phone: { type: Number },
    role: { type: String, default: "user" },
    name: { type: String }
})

var User = mongoose.model("Users", userSchema, "users")
module.exports = User