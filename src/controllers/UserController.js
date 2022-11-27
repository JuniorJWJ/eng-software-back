const User = require('../model/User');
const UserService = require('../services/UserService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    const { name, email, password } = request.body;
    const existUser = await UserService.getByEmail(email);

    if (existUser) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Já existe um usuário com esse email!',
      });
    }

    const user = {
      name,
      email,
      password: await bcrypt.hash(password, 8),
      imageURL: request.file.location,
      imageSize: request.file.size,
      imageKey: request.file.key,
    };

    try {
      await User.create(user);
      response
        .status(201)
        .json({ message: 'User inserido no sistema com sucesso' });
    } catch (error) {
      response.status(500).json({ error: error });
    }
  },

  async log_user(request, response) {
    const { email, password } = request.body;

    try {
      const user = await UserService.getByEmail(email);

      if (!user) {
        return response.status(500).json({
          erro: true,
          mensagem: 'Email incorreto!',
        });
      }

      const isPasswordsEqual = await bcrypt.compare(password, user.password);
      if (!isPasswordsEqual) {
        return response.status(500).json({
          erro: true,
          mensagem: 'Senha incorreta!',
        });
      }

      const token = jwt.sign({ id: user.id }, 'D62ST92Y7A6V7K5C6W9ZU6W8KS3', {
        //need put this in .env
        expiresIn: '30m', // 7 dia
      });

      const data = {
        id: user._id,
        name: user.name,
        email: user.email,
        imageURL: user.imageURL,
        imageKey: user.imageKey,
      };

      return response.status(200).json({
        erro: false,
        mensagem: 'Login realizado com sucesso!',
        token,
        ...data,
      });
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        erro: true,
        mensagem: 'Erro ao realizar o login!',
      });
    }
  },

  async listUsers(request, response) {
    try {
      const users = await User.find();

      const data = users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        imageURL: user.imageURL,
        imageKey: user.imageKey,
      }));

      return response.status(200).json({
        erro: false,
        data,
      });
    } catch (error) {
      return response.status(400).json({
        erro: true,
        mensagem: 'Nenhum usuário encontrado!',
      });
    }
  },

  async show(request, response) {
    const userId = request.params.id;

    try {
      const user = await User.findOne({ _id: userId });

      const data = {
        id: user._id,
        name: user.name,
        email: user.email,
        imageURL: user.imageURL,
        imageKey: user.imageKey,
      };

      if (user) {
        return response.status(200).json({
          erro: false,
          ...data,
        });
      }

      return response.status(400).json({
        erro: true,
        mensagem: 'Nenhum usuário encontrado!',
      });
    } catch (error) {
      return response.status(400).json({
        erro: true,
        mensagem: 'Erro ao buscar usuário!',
      });
    }
  },

  async delete(request, response) {
    const userId = request.params.id;

    try {
      await User.deleteOne({ _id: userId });

      return response.status(200).json({
        erro: false,
        mensagem: 'Usuário removido com sucesso',
      });
    } catch (error) {
      return response.status(400).json({
        erro: true,
        mensagem: 'Erro ao remover usuário!',
      });
    }
  },

  async update(request, response) {
    const userId = request.params.id;
    const { name, email, password } = request.body;

    const updatedUser = {
      name,
      email,
      password: await bcrypt.hash(password, 8),
      imageURL: request.file.location,
      imageSize: request.file.size,
      imageKey: request.file.key,
    };

    if (!updatedUser.imageURL) {
      const userBDteste = await User.findOne({ _id: userId });
      updatedUser.imageURL = userBDteste.imageURL;
      updatedUser.imageSize = userBDteste.imageSize;
      updatedUser.imageKey = userBDteste.imageKey;
    }

    try {
      await User.updateOne(
        { _id: userId },
        {
          $set: {
            name: updatedUser.name,
            email: updatedUser.email,
            password: updatedUser.password,
            imageURL: updatedUser.imageURL,
            imageSize: updatedUser.imageSize,
            imageKey: updatedUser.imageKey,
          },
        },
      );

      return response.status(200).json({
        erro: false,
        mensagem: 'Usuário atualizado com sucesso!',
      });
    } catch (error) {
      return response.status(400).json({
        erro: true,
        mensagem: 'Erro ao atualizar usuário!',
      });
    }
  },

  async update_password(request, response) {
    const userId = request.params.id;

    const { password, newPassword } = request.body;

    try {
      const user = await User.findOne({ _id: userId });

      const isPasswordsEqual = await bcrypt.compare(password, user.password);
      if (!isPasswordsEqual) {
        return response.status(500).json({
          erro: true,
          mensagem: 'A antiga senha está incorreta!',
        });
      }
      const updatedPassword = await bcrypt.hash(newPassword, 8);

      await User.updateOne(
        { _id: userId },
        { $set: { password: updatedPassword } },
      );

      return response.status(200).json({
        erro: false,
        mensagem: 'Senha atualizada com sucesso!',
      });
    } catch (error) {
      return response.status(400).json({
        erro: true,
        mensagem: 'Erro ao atualizar a senha!',
      });
    }
  },
  async getSignedUrl(request, response) {
    const userId = request.params.id;
    let user = '';
    try {
      user = await User.findById(userId);
    } catch (error) {
      response.send('Arquivo não encontrado!');
    } finally {
      if (user) {
        const command = new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: user['imageKey'],
        });
        const url = await getSignedUrl(s3, command, { expiresIn: 15 * 60 }); // expires in seconds
        response.json({ url: url });
      } else {
        response.send('Arquivo não encontrado em nossa base da dados');
      }
    }
  },
};
