var express = require('express')
var router = express.Router()
var cartController = require('../controllers/carts.controller')
var authController = require('../controllers/auth.controller')

router.post('/create', cartController.postCreateCart)

router.use(authController.verifyToken)
router.post('/addtocart', cartController.postAddToUserCart)
router.post('/removefromcart', cartController.postRemoveFromUserCart)
router.get('/getall', authController.checkingRole, cartController.getAllCart)

module.exports = router