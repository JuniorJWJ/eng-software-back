const User = require('../model/User')
const { eAdmin } = require('../../middlewares/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  async create(req, res) {
    await User.create({
      name: req.body.name,
      password: await bcrypt.hash( req.body.password, 8), 
      email: req.body.email,
      avatar: req.file ? `http://localhost:3000/images/${req.file.filename}` : ''
    })
    .then(() => {
        return res.json({
            erro: false,
            mensagem: "User cadastrado com sucesso!"
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: User não cadastrado com sucesso!"
        });
    });    
  },
  async log_user(req, res) {
    const userEmail = req.body.email
    const user = await User.return_info(userEmail)
    console.log("user: ", user)
    if(user == null || user.length === 0){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário ou a senha incorreta! Nenhum usuário com este e-mail"
        });
    }
    if(!(await bcrypt.compare(req.body.password, user[0].password))){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário ou a senha incorreta! Senha incorreta!"
        });
    }
    var token = jwt.sign({id: user[0].id}, "D62ST92Y7A6V7K5C6W9ZU6W8KS3", { //need put this in .env
        expiresIn: '30m' // 7 dia
    });
    const data = {
      id: user[0].id,
      name: user[0].name,
      email: user[0].email,
      avatar: user[0].avatar,
    }
    return res.json({
        erro: false,
        mensagem: "Login realizado com sucesso!",
        token,
        ...data
    });
  },
  async show_users(req, res){
    await User.get().then((users) => {
        return res.json({
            erro: false,
            users,
            id_usuario_logado: req.userId
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Nenhum usuário encontrado!"
        });
    });    
  },
  async show(req, res){
    const userId = req.params.id

    await User.show(userId).then((users) => {
        return res.json({
            erro: false,
            ...users,
            id_usuario_logado: req.userId
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Nenhum usuário encontrado!"
        });
    });    
  },
  async delete(req, res) {
    const userId = req.params.id
  
    try{
      await User.delete(userId)
      res.status(200).json({msg: 'User deleted successfully'})
    } catch (error) {
      res.status(500).json({msg: 'Fail in delete user'})
    }
  },
  async update(req, res) {
    const userID = req.params.id

    var updatedUser = {
        name: req.body.name,
        email: req.body.email,
        avatar: req.file ? `http://localhost:3000/images/${req.file.filename}` : ''
    }
    if(!updatedUser.avatar){
      var userBDteste = await User.show(userID)
      updatedUser.avatar = userBDteste[0].avatar
    }
    try{
      await User.update(updatedUser, userID)
      res.status(201).json({msg: 'User update sucessfully'})
    } catch (error) {
      res.status(500).json({msg: 'Fail in Server '})
      console.log(error)
    }
  },
  async update_password(req, res){
    const userID = req.params.id
    if(req.body.password === req.body.confirmPassword){
      var updatedUser = {
        password: await bcrypt.hash( req.body.password, 8)
      }

      try{
        await User.update_password(updatedUser, userID)
        res.status(201).json({msg: 'User password update sucessfully'})
      } catch (error) {
        res.status(500).json({msg: 'Fail in Server '})
        console.log(error)
      }
    }else{
      res.status(500).json({msg: 'Passwords not matched.'})
    }
  }
}