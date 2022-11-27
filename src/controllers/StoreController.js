const Store = require('../model/Store');
const StoreService = require('../services/StoreService');
const User = require('../model/User');

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
    const { name } = request.body;
    const idUser = request.params.id.toString();
    const amountSold = 0;
    const amountRates = 0;
    const products = [];
    const userHaveStore = await StoreService.userHaveStore(idUser);

    if (idUser.length < 24 || idUser.length > 24) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Este ID não é válido!',
      });
    }

    const existUser = await User.findOne({ _id: idUser });

    if (!existUser) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Esse Usuário não existe!',
      });
    }

    if (userHaveStore) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Já existe uma loja desse usuário criada!',
      });
    }

    const store = {
      idUser,
      name,
      amountRates,
      amountSold,
      products,
      imageURL: request.file.location,
      imageSize: request.file.size,
      imageKey: request.file.key,
    };

    try {
      await Store.create(store); // preciso ver se isso fica no services ou controller

      response
        .status(201)
        .json({ message: 'Loja inserida no sistema com sucesso' });
    } catch (error) {
      response.status(500).json({ error: error });
    }
  },

  async listStores(request, response) {
    try {
      const stores = await Store.find();

      const data = stores.map(store => ({
        id: store._id,
        name: store.name,
        amountRates: store.amountRates,
        amountSold: store.amountSold,
        products: store.products,
        imageURL: store.location,
        imageSize: store.size,
        imageKey: store.key,
      }));

      return response.status(200).json({
        erro: false,
        data,
      });
    } catch (error) {
      return response.status(400).json({
        erro: true,
        mensagem: 'Nenhuma loja encontrada!',
      });
    }
  },

  async show(request, response) {
    const storeId = request.params.id;

    try {
      const store = await Store.findOne({ _id: storeId });

      const data = {
        id: store._id,
        name: store.name,
        amountRates: store.amountRates,
        image: store.image,
        amountSold: store.amountSold,
        products: store.products,
      };

      if (store) {
        return response.status(200).json({
          erro: false,
          ...data,
        });
      }

      return response.status(400).json({
        erro: true,
        mensagem: 'Nenhuma loja encontrada!',
      });
    } catch (error) {
      return response.status(400).json({
        erro: true,
        mensagem: 'Erro ao buscar loja!',
      });
    }
  },

  async delete(request, response) {
    const storeId = request.params.id.toString();
    const idUser = request.params.idUser;
    const userHaveStore = await StoreService.userHaveStore(idUser);

    if (!userHaveStore) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Esse usuário não tem loja cadastrada!',
      });
    }
    if (storeId.length < 24 || storeId.length > 24) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Este ID não é válido!',
      });
    }
    if (!(await Store.findById(storeId))) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Essa loja não existe no sistema!',
      });
    }

    try {
      await Store.deleteOne({ _id: storeId });

      return response.status(200).json({
        erro: false,
        mensagem: 'Loja removida com sucesso',
      });
    } catch (error) {
      return response.status(400).json({
        erro: true,
        mensagem: 'Erro ao remover loja!',
      });
    }
  },

  async update(request, response) {
    const { name, amountRates, amountSold, products } = request.body;
    const storeId = request.params.id.toString();
    const idUser = request.params.idUser;
    const userHaveStore = await StoreService.userHaveStore(idUser);

    if (!userHaveStore) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Esse usuário não tem loja cadastrada!',
      });
    }
    if (storeId.length < 24 || storeId.length > 24) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Este ID não é válido!',
      });
    }
    if (!(await Store.findById(storeId))) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Essa loja não existe no sistema!',
      });
    }

    const updatedStore = {
      idUser,
      name,
      amountRates,
      amountSold,
      products,
      imageURL: request.file.location,
      imageSize: request.file.size,
      imageKey: request.file.key,
    };

    if (!updatedStore.imageURL) {
      const storeBDteste = await Store.findOne({ _id: storeId });
      updatedUser.imageURL = storeBDteste.imageURL;
      updatedUser.imageSize = storeBDteste.imageSize;
      updatedUser.imageKey = storeBDteste.imageKey;
    }

    console.log(updatedStore);
    try {
      await Store.updateOne(
        { _id: storeId },
        {
          $set: {
            name: updatedStore.name,
            amountRates: updatedStore.amountRates,
            image: updatedStore.image,
            amountSold: updatedStore.amountSold,
            products: updatedStore.products,
            imageURL: updatedStore.imageURL,
            imageSize: updatedStore.imageSize,
            imageKey: updatedStore.imageKey,
          },
        },
      );

      return response.status(200).json({
        erro: false,
        mensagem: 'Loja atualizada com sucesso!',
      });
    } catch (error) {
      return response.status(400).json({
        erro: true,
        mensagem: 'Erro ao atualizar Loja!',
      });
    }
  },
};
