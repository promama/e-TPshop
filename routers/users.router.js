var express = require('express')
var router = express.Router()
var userController = require('../controllers/users.controller')
var authController = require('../controllers/auth.controller')

router.post('/register', userController.postRegister)
router.get('/getall', userController.getallUser)
router.post('/login', userController.postlogin)

router.post('/googlelogin', userController.postLoginGoogle)

router.use(authController.verifyToken)
router.post('/update', userController.postUpdate)
router.delete('/:id', authController.checkAdmin, userController.deleteUser)

module.exports = router