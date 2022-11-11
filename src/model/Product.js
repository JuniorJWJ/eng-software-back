const mongoose = require('mongoose');

const Product = mongoose.model('Product', {
  idStore: String,
  name: String,
  description: String,
  image: String,
  type: String,
  quantity: Integer,
  price: Double,
});

module.exports = Product;
