const mongoose = require('mongoose');

const Auth = mongoose.model('User', {
  name: String,
  email: String,
  password: String,
  avatar: String,
});

module.exports = Auth;
