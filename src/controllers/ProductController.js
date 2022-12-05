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
        mensagem: 'Esse Produto não existe!',
      });
    }

    const store = {
      idStore,
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

  async listProducts(request, response) {
    try {
      const products = await Product.find();

      const data = products.map(product => ({
        id: product._id,
        idStore: product.idStore,
        title: product.title,
        price: product.price,
        promotionalPrice: product.promotionalPrice,
        description: product.description,
        category: product.category,
        type: product.type,
        stars: product.stars,
        stock: product.stock,
        amountSold: product.amountSold,
        amountRates: product.amountRates,
        imageURL: product.imageURL,
        imageKey: product.imageKey,
      }));

      return response.status(200).json({
        erro: false,
        data,
      });
    } catch (error) {
      return response.status(400).json({
        erro: true,
        mensagem: 'Nenhum produto encontrado!',
      });
    }
  },

  async show(request, response) {
    const productId = request.params.id;

    try {
      const product = await Product.findOne({ _id: productId });

      const data = {
        id: product._id,
        idStore: product.idStore,
        title: product.title,
        price: product.price,
        promotionalPrice: product.promotionalPrice,
        description: product.description,
        category: product.category,
        type: product.type,
        stars: product.stars,
        stock: product.stock,
        amountSold: product.amountSold,
        amountRates: product.amountRates,
        imageURL: product.imageURL,
        imageKey: product.imageKey,
      };

      if (product) {
        return response.status(200).json({
          erro: false,
          ...data,
        });
      }

      return response.status(400).json({
        erro: true,
        mensagem: 'Nenhum produto encontrado!',
      });
    } catch (error) {
      return response.status(400).json({
        erro: true,
        mensagem: 'Erro ao buscar produto!',
      });
    }
  },

  async delete(request, response) {
    const productId = request.params.id.toString();
    const idStore = request.params.idStore.toString();
    const storeHaveProduct = await ProductService.storeHaveProduct(idStore);
    const verifyStoreProduct = await ProductService.verifyStoreProduct(
      idStore,
      productId,
    );

    if (!verifyStoreProduct) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Este produto não pertence a esta loja!',
      });
    }

    if (idStore.length < 24 || idStore.length > 24) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Este ID de loja não é válido!',
      });
    }
    if (productId.length < 24 || productId.length > 24) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Este ID de produto não é válido!',
      });
    }

    const storeExist = await Store.findOne({ _id: idStore });

    if (!storeExist) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Essa loja não existe!',
      });
    }
    if (!storeHaveProduct) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Essa loja não tem produto cadastrado!',
      });
    }
    if (productId.length < 24 || productId.length > 24) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Este ID não é válido!',
      });
    }
    if (!(await Product.findById(productId))) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Esse produto não existe no sistema!',
      });
    }

    try {
      await Product.deleteOne({ _id: productId });

      return response.status(200).json({
        erro: false,
        mensagem: 'Produto removido com sucesso',
      });
    } catch (error) {
      return response.status(400).json({
        erro: true,
        mensagem: 'Erro ao remover produto!',
      });
    }
  },

  async update(request, response) {
    const {
      title,
      price,
      promotionalPrice,
      description,
      category,
      type,
      stock,
    } = request.body;
    const productId = request.params.id.toString();
    const idStore = request.params.idStore.toString();
    const storeHaveProduct = await ProductService.storeHaveProduct(idStore);
    const verifyStoreProduct = await ProductService.verifyStoreProduct(
      idStore,
      productId,
    );

    if (!verifyStoreProduct) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Este produto não pertence a esta loja!',
      });
    }

    if (idStore.length < 24 || idStore.length > 24) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Este ID de loja não é válido!',
      });
    }
    if (productId.length < 24 || productId.length > 24) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Este ID de produto não é válido!',
      });
    }

    const storeExist = await Store.findOne({ _id: idStore });

    if (!storeExist) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Essa loja não existe!',
      });
    }
    if (!storeHaveProduct) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Essa loja não tem produto cadastrado!',
      });
    }
    if (productId.length < 24 || productId.length > 24) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Este ID não é válido!',
      });
    }
    if (!(await Product.findById(productId))) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Esse produto não existe no sistema!',
      });
    }

    const updatedProduct = {
      title,
      price,
      promotionalPrice,
      description,
      category,
      type,
      stock,
      imageURL: request.file ? request.file.location : '',
      imageKey: request.file ? request.file.key : '',
    };

    try {
      await Product.updateOne(
        { _id: productId },
        {
          $set: {
            title: updatedProduct.title,
            price: updatedProduct.price,
            promotionalPrice: updatedProduct.promotionalPrice,
            description: updatedProduct.description,
            category: updatedProduct.category,
            type: updatedProduct.type,
            stock: updatedProduct.stock,
            imageURL: updatedProduct.imageURL,
            imageKey: updatedProduct.imageKey,
          },
        },
      );

      return response.status(200).json({
        erro: false,
        mensagem: 'Produto atualizado com sucesso',
      });
    } catch (error) {
      return response.status(400).json({
        erro: true,
        mensagem: 'Erro ao atualizar produto!',
      });
    }
  },
};
