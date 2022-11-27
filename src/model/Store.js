const mongoose = require('mongoose');

const Store = mongoose.model('Store', {
  idUser: String,
  name: String,
  amountRates: Number,
  avatar: String,
  amountSold: Number,
  products: Array,
  imageURL: String,
  imageSize: Number,
  imageKey: String,
});

module.exports = Store;
