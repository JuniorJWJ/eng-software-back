const express = require('express');


const { eAdmin } = require('../middlewares/auth');
const multer = require("multer");
const multerConfig = require("./config/multer")
const route = express.Router()



module.exports = route;