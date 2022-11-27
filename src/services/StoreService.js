const Store = require('../model/Store');

module.exports = {
  async userHaveStore(idUser) {
    try {
      const store = await Store.findOne({ idUser: idUser });

      return store;
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
};
