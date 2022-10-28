const express = require('express');
const server = express();
const route = require('./route');
const path = require('path');
const { resolve } = require('path');
const cors = require('cors');
const corsMiddleware = require('.././middlewares/cors.js');
const db = require('../src/db/init.js');

db.init();
server.use(cors());
server.set('views', path.join(__dirname, 'views'));
server.use(express.urlencoded({ extended: true }));
server.use(
  '/images',
  express.static(resolve(__dirname, '..', 'tmp', 'uploads')),
);
server.use(express.json());

server.use(route);

server.listen(3000, () => console.log('RODANDO'));
