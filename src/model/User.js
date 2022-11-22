const mongoose = require('mongoose');

const User = mongoose.model('User', {
  name: String,
  email: String,
  password: String,
  imageURL: String,
  imageSize: Number,
  imageKey: String,
});

module.exports = User;
