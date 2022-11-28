const Product = require('../model/Product');
const Store = require('../model/Store');
const ProductService = require('../services/ProductService');

////aws
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = {
  async create(request, response) {
    const {
      title,
      price,
      promotionalPrice,
      description,
      category,
      type,
      stock,
    } = request.body;
    const idStore = request.params.id.toString();
    const stars = 0;
    const amountSold = 0;
    const amountRates = 0;

    if (idStore.length < 24 || idStore.length > 24) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Este ID não é válido!',
      });
    }

    const storeExist = await Store.findOne({ _id: idStore });

    if (!storeExist) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Essa Loja não existe!',
      });
    }

    const store = {
      idStore: String,
      title,
      price,
      promotionalPrice,
      description,
      category,
      type,
      stars,
      stock,
      amountSold,
      amountRates,
      imageURL: request.file.location,
      imageSize: request.file.size,
      imageKey: request.file.key,
    };

    try {
      await Product.create(store);

      response
        .status(201)
        .json({ message: 'Produto inserido no sistema com sucesso' });
    } catch (error) {
      response.status(500).json({ error: error });
    }
  },
};
