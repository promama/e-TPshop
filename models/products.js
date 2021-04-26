const mongoose = require('mongoose')

var productSchema = new mongoose.Schema({
    name: String,
    id: Number,
    url: String,
    category: String,
    brand: String,
    description: String,
    price: Number,
    create_at: Date
})

var Product = mongoose.model("Products", productSchema, "products")
module.exports = Product