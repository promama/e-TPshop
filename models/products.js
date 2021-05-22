const mongoose = require('mongoose')

var productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    url: { type: String, default: "https://res.cloudinary.com/promama/image/upload/v1619347188/e-tpshop/image1_dx8woj.jpg" },
    category: { type: String },
    brand: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    create_at: { type: Date, default: Date.now }
})

var Product = mongoose.model("Products", productSchema, "products")
module.exports = Product