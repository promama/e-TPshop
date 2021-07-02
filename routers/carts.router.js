var express = require('express')
var router = express.Router()
var cartController = require('../controllers/carts.controller')
var authController = require('../controllers/auth.controller')

router.post('/create', cartController.postCreateCart)

router.use(authController.verifyToken)
router.post('/addtocart', cartController.postAddToUserCart)
router.post('/removefromcart', cartController.postRemoveFromUserCart)

module.exports = router