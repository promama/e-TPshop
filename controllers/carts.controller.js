var User = require("../models/users")
var Cart = require("../models/carts")
var Product = require("../models/products")
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')
var auth = require("../controllers/auth.controller")
var user = require("../controllers/users.controller")
const { json } = require("body-parser")

module.exports.postCreateCart = (req, res) => {
    var cart = new Cart({
        _id: new mongoose.Types.ObjectId
    })

    Cart
        .find({ _id: cart._id })
        .then(result => {
            if (result.length > 0) {
                res.json({
                    success: false,
                    message: "cart duplicate, can't create"
                })
            }
        })

    cart
        .save()
        .then(result => {
            console.log(result)
            res.json({
                success: true,
                message: "cart created",
                data: result
            })
        })
        .catch(err => {
            console.log(err)
        })
}

function createCart() {
    var cart = new Cart({
        _id: new mongoose.Types.ObjectId
    })

    cart.save()

    return cart
}

async function addtocart(product, userId, quantity) {
    var filter = { userId: userId }
    console.log("filter: " + filter)

    const update = { _id: product._id , quantity: quantity, price: product.price, name: product.name, status: "waiting approve"}
    console.log("update value: %j", update)

    total_add = product.price * quantity
    console.log("amount add to cart: " + total_add)

    try {
        var products = await Cart.find(filter)
        //console.log(products[0].products)

        var list_products = new Array()
        list_products = await products[0].products

        console.log(list_products)

        var bool = false

        //check duplicate product to add quantity not add more product
        list_products.every(item => {
            if (item.name == product.name && item.price == product.price && item.status == "waiting approve") {
                filter = { userId: userId, products: { $elemMatch: { price: product.price }}}
                console.log("filter elemMatch: %j", filter)
                console.log("filter success")
                bool = true
                return false
            }
        })
        if (bool == false) {
            await Cart.findOneAndUpdate(filter, { "$push": { "products": update }, "$inc": { total: total_add }})
        } else {
            await Cart.findOneAndUpdate(filter, { "$inc": { total: total_add, 'products.$.quantity': quantity }})
        }
    } catch (error) {
        console.log(error)
        return "fail"
    }
    
    return "success"
}

module.exports.postAddToUserCart = async (req, res) => {
    const authHeader = req.headers['authorization']
    //check if it have authHeader => token = undefined or token
    const token = authHeader && authHeader.split(' ')[1]

    //console.log(token)
    var userId = await auth.decrypt(token)
    console.log("user id: %j", userId._id)

    var product = await Product.find({ _id: req.body.productId})
    console.log("product detail: " + product[0])

    if (product.length != 0) {
        if (product[0].remain > 0 && req.body.quantity <= product[0].remain) {
            console.log("you can buy")

            var result = await addtocart(product[0], userId._id, req.body.quantity)
            console.log("result: " + result)

            if (result === "success") {
                await Product.findOneAndUpdate({ _id: req.body.productId }, { remain: product[0].remain - req.body.quantity })
                res.json({
                    success: true,
                    message: "add product(s) to cart"
                })    
            }
        } else {
            console.log("not enough product")
            res.json({
                success: false,
                message: "not enough product"
            })
        }
    } else {
        console.log("no product found")
        res.json({
            success: false,
            message: "can't find product"
        })
    }
}

module.exports.postRemoveFromUserCart = async (req, res) => {

}