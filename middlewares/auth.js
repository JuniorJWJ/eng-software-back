const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = {
  eAdmin: async function (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!authHeader) {
      return res.status(401).json({
        erro: true,
        mensagem: 'Token inválido!',
      });
    }

    try {
      const decode = await promisify(jwt.verify)(
        token,
        'D62ST92Y7A6V7K5C6W9ZU6W8KS3',
      );
      req.userId = decode.id;
      return next();
    } catch (err) {
      return res.status(400).json({
        erro: true,
        mensagem: "Falha na autenticação!",
      });
    }
  },
};
