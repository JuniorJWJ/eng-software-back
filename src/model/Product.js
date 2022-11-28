const mongoose = require('mongoose');

const Product = mongoose.model('Product', {
  idStore: String,
  title: String,
  price: Number,
  promotionalPrice: Number,
  description: String,
  category: String,
  type: String,
  stars: Number, //
  stock: Number,
  amountSold: Number, //
  amountRates: Number, //
  imageURL: String,
  imageSize: Number,
  imageKey: String,
});

module.exports = Product;
