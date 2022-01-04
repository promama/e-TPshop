var express = require('express')
var router = express.Router()
var cartController = require('../controllers/carts.controller')
var authController = require('../controllers/auth.controller')
var historyController = require('../controllers/history.controller')

router.use(authController.verifyToken)

router.get('/bought', authController.checkUser, historyController.getCartBought)

module.exports = router