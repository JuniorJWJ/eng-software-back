const Store = require('../model/Store');
const StoreService = require('../services/StoreService');

module.exports = {
  async create(request, response) {
    const { name, description } = request.body;
    const idUser = request.params.id;
    const soldQuantity = 0;

    const store = {
      idUser,
      name,
      description,
      image: request.file
        ? `http://localhost:3000/images/${request.file.filename}`
        : '',
      soldQuantity,
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

      return response.status(200).json({
        erro: false,
        stores,
      });
    } catch (error) {
      return response.status(400).json({
        erro: true,
        mensagem: 'Nenhuma loja encontrada!',
      });
    }
  },
};
