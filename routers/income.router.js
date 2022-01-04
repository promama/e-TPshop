var express = require('express')
var router = express.Router()
var cartController = require('../controllers/carts.controller')
var authController = require('../controllers/auth.controller')
var incomeController = require('../controllers/income.controller')

router.use(authController.verifyToken)

router.get('/getall', authController.checkHighTierUser, incomeController.getIncome)

module.exports = router