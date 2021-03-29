var express = require('express')
var router = express.Router()
var userController = require('../controllers/users.controller')

router.post('/register', userController.postRegister)
router.get('/find', userController.getUser)

module.exports = router