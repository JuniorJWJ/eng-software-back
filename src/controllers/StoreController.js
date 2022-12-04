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
      imageURL: request.file ? request.file.location : '',
      imageKey: request.file ? request.file.key : '',
    };

    try {
      await Store.create(store);

      return response.status(201).json({
        erro: false,
        store,
        message: 'Loja inserida no sistema com sucesso',
      });
    } catch (error) {
      response.status(500).json({ error: error });
    }
  },

  async listStores(request, response) {
    try {
      const stores = await Store.find();

      const data = stores.map(store => ({
        id: store._id,
        idUser: store.idUser,
        name: store.name,
        amountRates: store.amountRates,
        amountSold: store.amountSold,
        products: store.products,
        imageURL: store.imageURL,
        imageKey: store.imageKey,
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
        amountSold: store.amountSold,
        products: store.products,
        imageURL: store.imageURL,
        imageKey: store.imageKey,
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

  async showStoreByUser(request, response) {
    const userID = request.params.id;

    try {
      const store = await Store.findOne({ idUser: userID });

      const data = {
        id: store._id,
        name: store.name,
        amountRates: store.amountRates,
        amountSold: store.amountSold,
        products: store.products,
        imageURL: store.imageURL,
        imageKey: store.imageKey,
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
    const verifyUserStore = await StoreService.verifyUserStore(idUser);

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

    if (!verifyUserStore) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Esta loja não pertence a esse usuário!',
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
    const { name } = request.body;
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
      name,
      imageURL: request.file ? request.file.location : '',
      imageKey: request.file ? request.file.key : '',
    };

    if (!updatedStore.imageURL) {
      const storeBDteste = await Store.findOne({ _id: storeId });
      updatedStore.imageURL = storeBDteste.imageURL;
      updatedStore.imageKey = storeBDteste.imageKey;
    }

    console.log(updatedStore);
    try {
      await Store.updateOne(
        { _id: storeId },
        {
          $set: {
            name: updatedStore.name,
            imageURL: updatedStore.imageURL,
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

  async getSignedUrl(request, response) {
    const storeId = request.params.id;
    let store = '';
    try {
      store = await Store.findById(storeId);
      console.log(store);
    } catch (error) {
      response.send('Arquivo não encontrado!');
    } finally {
      if (store) {
        const command = new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: store['imageKey'],
        });
        const url = await getSignedUrl(s3, command, { expiresIn: 15 * 60 }); // expires in seconds
        response.json({ url: url });
      } else {
        response.send('Arquivo não encontrado em nossa base da dados');
      }
    }
  },
};
