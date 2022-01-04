var express = require('express')
var router = express.Router()
var productController = require('../controllers/products.controller')
var authController = require('../controllers/auth.controller')

router.get('/getall', productController.getallProduct)
router.get('/search', productController.getSearchResult)

router.use(authController.verifyToken)
router.use(authController.roleCheck)
router.post('/create', productController.postCreateProduct)
router.post('/uploadImage', productController.postUploadImage)
router.post('/update', productController.postUpdateProduct)
router.delete('/:id', productController.deleteProduct)
router.get('/download', productController.downloadImgProduct)

module.exports = router