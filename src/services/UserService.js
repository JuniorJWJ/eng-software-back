const User = require('../model/User');

module.exports = {
  async getByEmail(email) {
    try {
      const user = await User.findOne({ email: email });

      return user;
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
};
