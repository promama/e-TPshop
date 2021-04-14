const mongoose = require('mongoose')

var cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    products: [
        {
        itemId: String,
        quantity: Number,
        price: Number,
        name: String
        }
    ]
})

var Cart = mongoose.model("Carts", cartSchema, "carts")
module.exports = Cart