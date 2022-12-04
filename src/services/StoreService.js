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
  async verifyUserStore(idUser) {
    try {
      const store = await Store.findOne({ idUser: idUser });

      if (store) {
        if (store.idUser == idUser) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    } catch (error) {
      console.log({ error: error });
    }
  },
};
