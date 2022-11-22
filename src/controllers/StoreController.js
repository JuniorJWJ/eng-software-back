const Store = require('../model/Store');
const StoreService = require('../services/StoreService');

module.exports = {
  async create(request, response) {
    const { name, description } = request.body;
    const idUser = request.params.id;
    const amountSold = 0;
    const amountRates = 0;
    const products = [];

    const store = {
      idUser,
      name,
      description,
      avatar: request.file
        ? `http://localhost:3000/images/${request.file.filename}`
        : '',
      amountSold,
      amountRates,
      products,
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
        image: store.image,
        amountSold: store.amountSold,
        products: store.products,
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
    const storeID = request.params.id;

    try {
      await Store.deleteOne({ _id: storeID });

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
    console.log(request.body);
    const storeId = request.params.id;
    const { name, description, soldQuantity } = request.body;
    const idUser = request.params.idUser;

    const updatedStore = {
      idUser,
      name,
      description,
      avatar: request.file
        ? `http://localhost:3000/images/${request.file.filename}`
        : '',
      amountSold,
      amountRates,
      products,
    };

    if (!updatedStore.image) {
      const storeBDteste = await Store.findOne({ _id: storeId });
      updatedStore.image = storeBDteste.image;
    }

    console.log(updatedStore);
    try {
      await Store.updateOne(
        { _id: storeId },
        {
          $set: {
            name: updatedStore.name,
            description: updatedStore.description,
            image: updatedStore.image,
            soldQuantity: updatedStore.soldQuantity,
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
