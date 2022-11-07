const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  async create(request, response) {
    const { name, password, email } = request.body;
    const user = await User.getByEmail(email);

    if (user) {
      return response.status(200).json({
        erro: false,
        mensagem: 'Já existe um usuário com esse email!',
      });
    }

    try {
      await User.create({
        name,
        password: await bcrypt.hash(password, 8),
        email,
        avatar: request.file
          ? `http://localhost:3000/images/${request.file.filename}`
          : '',
      });

      return response.status(200).json({
        erro: false,
        mensagem: 'User cadastrado com sucesso!',
      });
    } catch (error) {
      return response.status(400).json({
        erro: true,
        mensagem: 'User não cadastrado com sucesso!',
      });
    }
  },

  async log_user(request, response) {
    const { email, password } = request.body;

    try {
      const user = await User.getByEmail(email);

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

      const token = jwt.sign({ id: user.id }, "D62ST92Y7A6V7K5C6W9ZU6W8KS3", {
        //need put this in .env
        expiresIn: '30m', // 7 dia
      });

      const data = {
        id: user.id,
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
      return response.status(400).json({
        erro: true,
        mensagem: 'Erro ao realizar o login!',
      });
    }
  },

  async listUsers(request, response) {
    try {
      const users = await User.list();

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
    const { userId } = request;

    try {
      const user = await User.show(userId);

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
      await User.delete(userId);

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
    const { name, email } = request.body;

    var updatedUser = {
      name,
      email,
      avatar: request.file
        ? `http://localhost:3000/images/${request.file.filename}`
        : '',
    };

    try {
      if (!updatedUser.avatar) {
        const userBDteste = await User.show(userId);
        updatedUser.avatar = userBDteste.avatar;

        return response.status(200).json({
          erro: false,
          mensagem: 'Usuário atualizado com sucesso!',
        });
      }

      await User.update(updatedUser, userId);
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
      const user = await User.getById(userId);

      const isPasswordsEqual = await bcrypt.compare(password, user.password);
      if (!isPasswordsEqual) {
        return response.status(500).json({
          erro: true,
          mensagem: 'A antiga senha está incorreta!',
        });
      }

      const updatedPassword = await bcrypt.hash(newPassword, 8);

      await User.update_password(updatedPassword, userId);

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
