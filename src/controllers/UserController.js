const User = require('../model/User');
const UserService = require('../services/UserService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
      avatar: request.file
        ? `http://localhost:3000/images/${request.file.filename}`
        : '',
    };

    try {
      await User.create(user); // preciso ver se isso fica no services ou controller

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
      // console.log(user);
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
        avatar: user.avatar,
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

      return response.status(200).json({
        erro: false,
        users,
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

      if (user) {
        return response.status(200).json({
          erro: false,
          user,
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
      avatar: request.file
        ? `http://localhost:3000/images/${request.file.filename}`
        : '',
    };

    if (!updatedUser.avatar) {
      const userBDteste = await User.findOne({ _id: userId });
      updatedUser.avatar = userBDteste.avatar;
    }
    console.log(updatedUser);
    try {
      await User.updateOne(
        { _id: userId },
        {
          $set: {
            name: updatedUser.name,
            email: updatedUser.email,
            password: updatedUser.password,
            avatar: updatedUser.avatar,
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
    console.log(password);
    console.log(newPassword);

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
};
