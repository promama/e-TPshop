var express = require('express')
var router = express.Router()
var cartController = require('../controllers/carts.controller')
var authController = require('../controllers/auth.controller')
const createApplication = require('express/lib/express')

router.post('/create', cartController.postCreateCart)

router.use(authController.verifyToken)
router.post('/addtocart', cartController.postAddToUserCart)
router.post('/removefromcart', cartController.postRemoveFromUserCart)
router.get('/getall', authController.checkUser, cartController.getAllCart)
router.get('/purchase', authController.checkUser, cartController.purchase)

module.exports = router