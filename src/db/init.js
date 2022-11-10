const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const server = express();
// const dbUser = process.env.DB_USER;
// const dbPassword = process.env.DB_PASS;

// mongoose
//   .connect(
//     `mongodb+srv://${dbUser}:${dbPassword}@cluster-eng-software.j94ua61.mongodb.net/?retryWrites=true&w=majority`,
//   )
//   .then(() => {
//     server.listen(3000, () => console.log('RODANDO'));
//     console.log('Conectou ao banco!');
//   })
//   .catch(err => console.log(err));
