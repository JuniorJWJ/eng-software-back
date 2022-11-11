const mongoose = require('mongoose');

const Store = mongoose.model('Store', {
  idUser: String,
  name: String,
  description: String,
  image: String,
  soldQuantity: Number,
});

module.exports = Store;
