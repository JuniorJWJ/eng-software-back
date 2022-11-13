const express = require('express');
const UserController = require('./controllers/UserController');

const { eAdmin } = require('../middlewares/auth');
const multer = require('multer');
const multerConfig = require('./config/multer');
const StoreController = require('./controllers/StoreController');
const route = express.Router();

//User
// route.get('/api/user/list', eAdmin, UserController.listUsers)
route.get('/list', UserController.listUsers); // teste
route.get('/api/user/list', eAdmin, UserController.listUsers);
route.get('/api/user/show/:id', eAdmin, UserController.show);
route.post(
  '/api/user/register',
  multer(multerConfig).single('file'),
  UserController.create,
);
route.post('/api/login', UserController.log_user);
route.post('/api/logout', UserController.logout_user);
route.put('/api/user/update/:id', eAdmin, UserController.update);
route.put(
  '/api/user/reset-password/:id',
  eAdmin,
  UserController.update_password,
);
route.delete('/api/user/delete/:id', eAdmin, UserController.delete);

//Store
route.post(
  '/api/store/register/:id',
  multer(multerConfig).single('file'),
  StoreController.create,
);
route.get('/api/store/list', eAdmin, StoreController.listStores);
route.get('/api/store/show/:id', eAdmin, StoreController.show);
route.delete('/api/store/delete/:id', eAdmin, StoreController.delete);

module.exports = route;
