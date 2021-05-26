var express = require('express')
var router = express.Router()
var productController = require('../controllers/products.controller')

router.post('/create', productController.postCreateProduct)
router.get('/getall', productController.getallProduct)
router.get('/search', productController.getSearchResult)

module.exports = router