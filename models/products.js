const mongoose = require('mongoose')

var productSchema = new mongoose.Schema({
    name: String,
    category: String,
    brand: String,
    description: String,
    create_at: Date
})

var Product = mongoose.model("Products", productSchema, "products")
module.exports = Product