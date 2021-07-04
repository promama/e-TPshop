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
        for (let i = 0; i < list_products.length; i++) {
            var a = new mongoose.Types.ObjectId(list_products[i]._id)
            console.log("a: " + a)

            var b = new mongoose.Types.ObjectId(product._id)
            console.log("b: " + b)

            if (a.equals(b)) {
                console.log("equal")

                filter = { userId: userId, products: { $elemMatch: { price: product.price }}}
                console.log("filter elemMatch: %j", filter)

                bool = true
                break
            }
        }

        if (bool == false) {
            //add product
            await Cart.findOneAndUpdate(filter, { "$push": { "products": update }, "$inc": { total: total_add }})
        } else {
            //update product with new quantity
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
    const authHeader = req.headers['authorization']
    //check if it have authHeader => token = undefined or token
    const token = authHeader && authHeader.split(' ')[1]

    //console.log(token)
    var userId = await auth.decrypt(token)
    console.log("user id: %j", userId._id)

    //request: productId, price, name, quantity
    console.log(req.body.productId + " " + req.body.price + " " + req.body.name + " " + req.body.quantity)

    //find user's cart
    var product = await Cart.find({ userId: userId })
    console.log(product)

    //products in user's cart
    var products_in_cart = await product[0].products
    console.log(products_in_cart)
    
    var quantity = 0, price = 0
    
    //find product's quantity and price of product match request 
    for (let i = 0; i < products_in_cart.length; i++) {
        if (products_in_cart[i]._id == req.body.productId) {
            console.log("match at: " + i)

            quantity = await products_in_cart[i].quantity
            price = await products_in_cart[i].price
        }
    }

    console.log("quantity in cart: " + quantity)
    console.log("price in cart:" + price)

    //quantity request > quantity in cart
    if (quantity < req.body.quantity) {
        res.json({
            success: false,
            message: "not enough quantity to delete"
        })
    } else {
        console.log("ready to subtract")

        //precalculate quantity after subtract
        let quantity_after = await quantity - req.body.quantity
        console.log("quantity after subtract: " + quantity_after)

        //precalculate money after subtract
        let amount_money_after = await product[0].total - req.body.quantity * price
        console.log("amount money after subtract: " + amount_money_after)

        //check if precalculate money is negative
        if (amount_money_after < 0) {
            res.json({
                success: false,
                message: "total money is negative"
            })
        }

        //update query
        const update = { _id: req.body.productId , quantity: quantity_after, price: req.body.price, name: req.body.name, status: "waiting approve"}

        //remove product from cart
        await Cart.update({ userId: userId }, { $pull: { products: { _id: req.body.productId } } })

        //quantity request < quantity in cart
        if (quantity > req.body.quantity) {
            //add product to cart and decrease total money
            await Cart.update({ userId: userId }, { $push: { products: update }, $inc: { total: req.body.quantity * price * -1 } })
            res.json({
                success: true,
                message: "decrease quantity in cart"
            })
        } 
        //quantity request == quantity in cart
        else {
            //decrease total money
            await Cart.update({ userId: userId }, { $inc: { total: req.body.quantity * price * -1 } })
            res.json({
                success: true,
                message: "product is deleted in cart"
            })
        }
    }
}

module.exports.getAllCart = async (req, res) => {
    //req.mid.role
    if (req.mid.role == "user") {
        var cart = Cart.find({ _id: req.mid._id })

        console.log(cart)
    }
}