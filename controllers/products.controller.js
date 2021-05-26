var User = require("../models/users")
var Cart = require("../models/carts")
var Product = require("../models/products")
const { search } = require("../routers/products.router")
const { where } = require("../models/products")

//create account
module.exports.postCreateProduct = async(req, res) => {
    //create product with request from body
    try {
        var product = await Product.create( {name: req.body.name, category: req.body.category, brand: req.body.brand, description: req.body.description, price: req.body.price})
        await product.save()
    } catch {
        console.log("we have problem")
    }

    //return value
    res.status(201).json({
        success: true,
        data: product
    })
}

//find all products
module.exports.getallProduct = async(req, res) => {

    /* request from body
    {
        max: Number,
        min: Number,
        name: String,
        brand: String,
        category: String,
    }
    */

    if (req.body.name) {
        console.log("product exist")
        console.log(typeof(req.body.min))
    } else {
        console.log("product not exist")
    }

    let allProduct = Object()

    try {
        if (req.body.name) {
            if (req.body.brand) {
                if (req.body.max != null && req.body.min != null) {
                    allProduct = await Product.find({name: { $regex: req.body.name, $options: "i" }, brand: { $regex: req.body.brand, $options: "i" }, price: { $lte: req.body.max, $gte: req.body.min }}).exec()
                } else if (req.body.max == null && req.body.min == null) {
                    allProduct = await Product.find({name: { $regex: req.body.name, $options: "i" }, brand: { $regex: req.body.brand, $options: "i" }}).exec()
                } else if (req.body.max == null) {
                    allProduct = await Product.find({name: { $regex: req.body.name, $options: "i" }, brand: { $regex: req.body.brand, $options: "i" }, price: { $gte: req.body.min }}).exec()
                } else {
                    allProduct = await Product.find({name: { $regex: req.body.name, $options: "i" }, brand: { $regex: req.body.brand, $options: "i" }, price: { $lte: req.body.max}}).exec()
                }
            } else {
                if (req.body.max != null && req.body.min != null) {
                    allProduct = await Product.find({name: { $regex: req.body.name, $options: "i" }, price: { $lte: req.body.max, $gte: req.body.min }}).exec()
                } else if (req.body.max == null && req.body.min == null) {
                    allProduct = await Product.find({name: { $regex: req.body.name, $options: "i" }}).exec()
                } else if (req.body.max == null) {
                    allProduct = await Product.find({name: { $regex: req.body.name, $options: "i" }, price: { $gte: req.body.min }}).exec()
                } else {
                    allProduct = await Product.find({name: { $regex: req.body.name, $options: "i" }, price: { $lte: req.body.max}}).exec()
                }
            }
        } else {
            if (req.body.brand) {
                if (req.body.max != null && req.body.min != null) {
                    allProduct = await Product.find({brand: { $regex: req.body.brand, $options: "i" }, price: { $lte: req.body.max, $gte: req.body.min }}).exec()
                } else if (req.body.max == null && req.body.min == null) {
                    allProduct = await Product.find({brand: { $regex: req.body.brand, $options: "i" }}).exec()
                } else if (req.body.max == null) {
                    allProduct = await Product.find({brand: { $regex: req.body.brand, $options: "i" }, price: { $gte: req.body.min }}).exec()
                } else {
                    allProduct = await Product.find({brand: { $regex: req.body.brand, $options: "i" }, price: { $lte: req.body.max}}).exec()
                }
            } else {
                if (req.body.max != null && req.body.min != null) {
                    allProduct = await Product.find({price: { $lte: req.body.max, $gte: req.body.min }}).exec()
                } else if (req.body.max == null && req.body.min == null) {
                    allProduct = await Product.find().exec()
                } else if (req.body.max == null) {
                    allProduct = await Product.find({price: { $gte: req.body.min }}).exec()
                } else {
                    allProduct = await Product.find({price: { $lte: req.body.max}}).exec()
                }
            }
        }
    } catch (err) {
        console.log(err)
    }

    // try {
    //     if (req.body.name) {
            
    //         if (req.body.price.max) {
                
    //             if (req.body.price.min && !req.body.price.max) {
                    
    //                 allProduct = await Product.find()
    //                 .where('name').equals(req.body.name)
    //                 .where('price').gte(req.body.price.min)
    //                 .exec()
    //             } else if (req.body.price.max && !req.body.price.min) {
                    
    //                 allProduct = await Product.find()
    //                 .where('name').equals(req.body.name)
    //                 .where('price').lte(req.body.price.max)
    //                 .exec()
    //             } else if (req.body.price.max && req.body.price.min){
                    
    //                 allProduct = await Product.find()
    //                 .where('name').equals(req.body.name)
    //                 .where('price').lte(req.body.price.max).gte(req.body.price.min)
    //                 .exec()
    //             } else {
    //                 allProduct = await Product.find({name: { $regex: req.body.name, $options: "i" }})
                    
    //                 .exec()
    //             }
    //         } else {
                
    //             allProduct = await Product.find({name: { $regex: req.body.name, $options: "i" }})
    //             .exec()
    //         }
    //     } else {
            
    //         if (req.body.price) {
    //             if (req.body.price.min && !req.body.price.max) {
    //                 allProduct = await Product.find()
    //                 .where('price').gte(req.body.price.min)
    //                 .exec()
    //             } else if (req.body.price.max && !req.body.price.min) {
    //                 allProduct = await Product.find()
    //                 .where('price').lte(req.body.price.max)
    //                 .exec()
    //             } else if (req.body.price.max && req.body.price.min){
    //                 allProduct = await Product.find()
    //                 .where('price').lte(req.body.price.max).gte(req.body.price.min)
    //                 .exec()
    //             }
    //         } else {
    //             allProduct = await Product.find()
    //             .exec()
    //         }
    //     }
    // } catch(err) {
    //     console.log(err)
    // }

    /* SQL quere
        select *
        from products
        where name = req.body.name
             && brand = req.body.brand
              && category = req.body.category
               && price > req.body.price.min
                && price < req.body.price.max
    */

    console.log(req.body.name)
    console.log(allProduct)

    //check and return result founded
    try {
        //check if can find anything
        if (allProduct.length) {
            res.json({
                success: true,
                data: { allProduct }
            })
        }
        //fail to find anything
        else {
            res.json({
                success: false,
                message: "can't find any product"
            })
        }
    } catch {
        console.log("smth happen here")
        res.json({
            success: false,
            message: "error!!!"
        })
    }
}

//create account
module.exports.getSearchResult = async(req, res) => {
    // //create product with request from body
    // try {
    //     var product = await Product.create( {name: req.body.name, category: req.body.category, brand: req.body.brand, description: req.body.description, price: req.body.price})
    //     await product.save()
    // } catch {
    //     console.log("we have problem")
    // }

    // //return value
    // res.status(201).json({
    //     success: true,
    //     data: product
    // })

    if (req.body.target) {
        const result = await Product.find({name: { $regex: req.body.target, $options: "i" }}).exec().then(products => {
            if (products.length == 0) {
                res.json({
                    success: false,
                    message: "no product found"
                })
            } else {
                res.json({
                    success: true,
                    data: products
                })
            }
        })

        console.log(result)
    }
}