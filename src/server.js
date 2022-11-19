const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const server = express();
const route = require('./route');
const path = require('path');
const { resolve } = require('path');
const cors = require('cors');
const corsMiddleware = require('.././middlewares/cors.js');
const mongoose = require('mongoose');

server.use(cors());
// server.set('views', path.join(__dirname, 'views'));
server.use(express.urlencoded({ extended: true }));
server.use(morgan('dev'));
server.use(
  '/images',
  express.static(resolve(__dirname, '..', 'tmp', 'uploads')),
);
server.use(express.json());

server.use(route);

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster-eng-software.j94ua61.mongodb.net/?retryWrites=true&w=majority`,
  )
  .then(() => {
    server.listen(3000, () => console.log('RODANDO'));
    console.log('Conectou ao banco!');
  })
  .catch(err => console.log(err));
