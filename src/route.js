const express = require('express');

const userController = require('./controllers/userController');

const { eAdmin } = require('../middlewares/auth');
const multer = require("multer");
const multerConfig = require("./config/multer")
const route = express.Router()

//User
route.post('/api/user/register', userController.create)
route.post('/api/login', userController.log_user)
// route.get('/api/user/list', eAdmin, userController.show_users)
route.get('/api/user/list', eAdmin, userController.show_users)
route.get('/api/user/show/:id', eAdmin, userController.show)
route.delete('/api/user/delete/:id', eAdmin, userController.delete)
route.put('/api/user/update/:id', eAdmin, userController.update)



module.exports = route;