const express = require('express')
const UserController = require('../controller/controller')
const router = express.Router()
router.get('/allcomments', UserController.getAllcomments)
router.post('/addcomment' , UserController.addcomments)
router.delete('/deletecomment' ,UserController.deletecomment)
router.get('/allusers' , UserController.allusers)
router.delete('/deleteusers' , UserController.deleteusers)
router.post('/login', UserController.login);
router.put('/updatecredentials', UserController.updateCredentials);
router.get('/user/:id', UserController.getUserById);

module.exports = router;
