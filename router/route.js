const express = require('express')
const UserController = require('../controller/controller')
const router = express.Router()
router.get('/allcomments', UserController.getAllcomments)
router.post('/addcomment' , UserController.addcomments)
router.delete('/deletecomment' ,UserController.deletecomment)
router.get('/allusers' , UserController.allusers)
router.delete('/deleteusers' , UserController.deleteusers)

module.exports = router;
