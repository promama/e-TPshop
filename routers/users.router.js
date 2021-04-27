var express = require('express')
var router = express.Router()
var userController = require('../controllers/users.controller')
var authController = require('../controllers/auth.controller')

router.post('/register', userController.postRegister)
router.get('/getall', userController.getallUser)
router.delete('/:id', userController.deleteUser)
router.post('/login', userController.postlogin)

router.use(authController.verifyToken)
router.post('/update', userController.postUpdate)

module.exports = router