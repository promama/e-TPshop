var User = require("../models/users")
var Cart = require("../models/carts")
var Product = require("../models/products")

//create account
module.exports.postCreateProduct = async(req, res) => {
    //create new product
    const { name, category, brand, description } = req.body

    //create product with request from body
    try {
        var product = await Product.create(req.body)
        await product.save()
    } catch {
        res.json({
            err_location: "products.controller.js",
            err_posistion: "postCreateProduct",
            id: "create product with request from body"
        })
    }

    //return value
    res.status(201).json({
        success: true,
        data: product
    })
}

//find all products
module.exports.getallProduct = async(req, res) => {
    //find all products created
    const allProduct = await Product.find()

    //check and return result founded
    try {
        //check if can find anything
        if(allProduct.length) {
            res.json({
                success: true,
                data: { allProduct }
            })
        }
        //fail to find anything
        else {
            res.json({
                success: false,
                data: "can't find any product"
            })
        }
    } catch {
        res.json({
            err_location: "users.controller.js",
            err_posistion: "getallProduct",
            id: "check and return result founded"
        })
    }
}