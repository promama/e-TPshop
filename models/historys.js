const mongoose = require('mongoose')

var historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    products: [
        {
        _id: { type: mongoose.Schema.Types.ObjectId },
        quantity: { type: Number },
        price: { type: Number },
        name: { type: String },
        status: { type: String },
        modify_date: { type: Date, default: Date.now }
        }
    ],
    total: { type: Number, default: 0 },
    create_at: { type: Date, default: Date.now }
})

var History = mongoose.model("Historys", historySchema, "historys")
module.exports = History