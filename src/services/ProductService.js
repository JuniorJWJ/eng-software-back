const Product = require('../model/Product');

module.exports = {
  async storeHaveProduct(idStore) {
    try {
      const product = await Product.findOne({ idStore: idStore });

      return product;
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
  async verifyStoreProduct(idStore, productId) {
    try {
      const product = await Product.findOne({ _id: productId });

      if (product) {
        if (product.idStore == idStore) {
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
