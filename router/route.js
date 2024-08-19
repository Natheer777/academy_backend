const express = require('express')
const UserController = require('../controller/controller')
const router = express.Router()
router.get('/allcomments', UserController.getAllcomments)
router.post('/addcomment' , UserController.addcomments)

module.exports = router;