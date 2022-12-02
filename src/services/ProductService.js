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
  async verifyStoreProduct(idStore) {
    try {
      const product = await Product.findOne({ idStore: idStore });
      console.log(product);
      if (product.idStore == idStore) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log({ error: error });
    }
  },
};
