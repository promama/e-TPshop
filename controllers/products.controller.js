var User = require("../models/users")
var Cart = require("../models/carts")
var Product = require("../models/products")
const { search } = require("../routers/products.router")
const { where, findOneAndDelete } = require("../models/products")

var cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: 'promama',
    api_key: '139334147171543',
    api_secret: 'craJetrhtFoPh_lDK7xrV_ImYA0'
})

//create account
module.exports.postCreateProduct = async(req, res) => {
    //create product with request from body
    try {
        var product = await Product.create( { url:req.body.url, name: req.body.name, category: req.body.category, brand: req.body.brand, description: req.body.description, price: req.body.price})
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
                    allProduct = await Product.find({name: { $regex: req.body.name, $options: "i" }, brand: { $regex: req.body.brand, $options: "i" }, price: { $lte: req.body.max, $gte: req.body.min }}).sort([['price', -1]]).exec()
                } else if (req.body.max == null && req.body.min == null) {
                    allProduct = await Product.find({name: { $regex: req.body.name, $options: "i" }, brand: { $regex: req.body.brand, $options: "i" }}).sort([['price', -1]]).exec()
                } else if (req.body.max == null) {
                    allProduct = await Product.find({name: { $regex: req.body.name, $options: "i" }, brand: { $regex: req.body.brand, $options: "i" }, price: { $gte: req.body.min }}).sort([['price', -1]]).exec()
                } else {
                    allProduct = await Product.find({name: { $regex: req.body.name, $options: "i" }, brand: { $regex: req.body.brand, $options: "i" }, price: { $lte: req.body.max}}).sort([['price', -1]]).exec()
                }
            } else {
                if (req.body.max != null && req.body.min != null) {
                    allProduct = await Product.find({name: { $regex: req.body.name, $options: "i" }, price: { $lte: req.body.max, $gte: req.body.min }}).sort([['price', -1]]).exec()
                } else if (req.body.max == null && req.body.min == null) {
                    allProduct = await Product.find({name: { $regex: req.body.name, $options: "i" }}).sort([['price', -1]]).exec()
                } else if (req.body.max == null) {
                    allProduct = await Product.find({name: { $regex: req.body.name, $options: "i" }, price: { $gte: req.body.min }}).sort([['price', -1]]).exec()
                } else {
                    allProduct = await Product.find({name: { $regex: req.body.name, $options: "i" }, price: { $lte: req.body.max}}).sort([['price', -1]]).exec()
                }
            }
        } else {
            if (req.body.brand) {
                if (req.body.max != null && req.body.min != null) {
                    allProduct = await Product.find({brand: { $regex: req.body.brand, $options: "i" }, price: { $lte: req.body.max, $gte: req.body.min }}).sort([['price', -1]]).exec()
                } else if (req.body.max == null && req.body.min == null) {
                    allProduct = await Product.find({brand: { $regex: req.body.brand, $options: "i" }}).sort([['price', -1]]).exec()
                } else if (req.body.max == null) {
                    allProduct = await Product.find({brand: { $regex: req.body.brand, $options: "i" }, price: { $gte: req.body.min }}).sort([['price', -1]]).exec()
                } else {
                    allProduct = await Product.find({brand: { $regex: req.body.brand, $options: "i" }, price: { $lte: req.body.max}}).sort([['price', -1]]).exec()
                }
            } else {
                if (req.body.max != null && req.body.min != null) {
                    allProduct = await Product.find({price: { $lte: req.body.max, $gte: req.body.min }}).sort([['price', -1]]).exec()
                } else if (req.body.max == null && req.body.min == null) {
                    allProduct = await Product.find().sort([['price', -1]]).exec()
                } else if (req.body.max == null) {
                    allProduct = await Product.find({price: { $gte: req.body.min }}).sort([['price', -1]]).exec()
                } else {
                    allProduct = await Product.find({price: { $lte: req.body.max}}).sort([['price', -1]]).exec()
                }
            }
        }
    } catch (err) {
        console.log(err)
    }

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
    if (req.body.brand) {
        const result = await Product.find({}, {"_id": 0, "brand": 1})

        const seen = new Set()
        const filteredArr = result.filter(el => {
            const duplicate = seen.has(el.brand);
            seen.add(el.brand);
            return !duplicate;
        });

        let newArray = new Array()
        for (let i = 0; i < filteredArr.length; i++) {
            newArray.push(filteredArr[i].brand)
        }

        res.json({
            brand: newArray
        })
    } else if (req.body.category) {
        const result = await Product.find({}, {"_id": 0, "category": 1})

        const seen = new Set()
        const filteredArr = result.filter(el => {
            const duplicate = seen.has(el.category);
            seen.add(el.category);
            return !duplicate;
        })

        let newArray = new Array()
        for (let i = 0; i < filteredArr.length; i++) {
            newArray.push(filteredArr[i].category)
        }

        res.json({
            category: newArray
        })
    }
}

module.exports.postUpdateProduct = async(req, res) => {
    var update = new Object({ _id: req.body.productId })

    try {
        if (req.body.quantity) {
            update = await Object.assign(update, { quantity: req.body.quantity })
        }
        if (req.body.price) {
            update = await Object.assign(update, { price: req.body.price })
        }
        if (req.body.name) {
            update = await Object.assign(update, { name: req.body.name })
        }
        if (req.body.category) {
            update = await Object.assign(update, { category: req.body.category })
        }
        if (req.body.description) {
            update = await Object.assign(update, { description: req.body.description })
        }
    } catch (err) {
        console.log(err)
        res.json({
            success: false,
            message: "update product fail"
        })
    }
    
    console.log(update)

    const product = await Product.updateOne( {_id: req.body.productId}, update, { new: true } )
    console.log(product)

    res.json({
        success: true,
        message: "updated"
    })
}

module.exports.deleteProduct = async(req, res) => {
    var before = await Product.findOneAndDelete({ _id: req.params.id })
    console.log(before)

    res.json({
        success: true,
        message: "deleted"
    })
}