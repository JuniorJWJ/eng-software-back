const express = require('express');
const route = express.Router();
const { eAdmin } = require('../middlewares/auth');
const UserController = require('./controllers/UserController');
const StoreController = require('./controllers/StoreController');

const multer = require('multer');
const multerConfig = require('./config/multer');
const AWSV2 = require('./config/aws');

//User
route.get('/list', UserController.listUsers); // teste
route.get('/api/user/list', eAdmin, UserController.listUsers);
route.get('/api/user/show/:id', eAdmin, UserController.show);
route.post(
  '/api/user/register',
  multer(multerConfig).single('file'),
  UserController.create,
);
route.post('/api/login', UserController.log_user);
route.put(
  '/api/user/update/:id',
  eAdmin,
  multer(multerConfig).single('file'),
  UserController.update,
);
route.put(
  '/api/user/reset-password/:id',
  eAdmin,
  UserController.update_password,
);
route.delete('/api/user/delete/:id', eAdmin, UserController.delete);
route.get('/api/user/signed-url/:id', eAdmin, UserController.getSignedUrl);

//Store
route.post(
  '/api/store/register/:id',
  eAdmin,
  multer(multerConfig).single('file'),
  StoreController.create,
);
route.get('/api/store/list', eAdmin, StoreController.listStores);
route.get('/api/store/show/:id', eAdmin, StoreController.show);
route.delete('/api/store/delete/:idUser/:id', eAdmin, StoreController.delete);
route.put(
  '/api/store/update/:idUser/:id',
  eAdmin,
  multer(multerConfig).single('file'),
  StoreController.update,
);

/////////////////download S3

// route.get('/api/user/signed-url/:id', eAdmin, async (request, response) => {
//   let post = '';
//   /* Tratamento de error */
//   try {
//     user = await User.findById(request.params.id);
//   } catch (error) {
//     response.send('Arquivo não encontrado!');
//   } finally {
//     if (user) {
//       const command = new GetObjectCommand({
//         Bucket: process.env.BUCKET_NAME,
//         Key: user['imageKey'],
//       });
//       const url = await getSignedUrl(s3, command, { expiresIn: 15 * 60 }); // expires in seconds
//       // response.send(url);
//       response.json({ url: url });
//     } else {
//       response.send('Arquivo não encontrado em nossa base da dados');
//     }
//   }
// });
// route.get('/api/user/signed-url/:id', eAdmin, UserController.getSignedUrl);

module.exports = route;
