const Database = require('../db/config')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const yup = require('yup')

module.exports = {
    async get(){
        const db = await Database()
        const data = await db.all(`SELECT * FROM user`)

        await db.close()

        return data.map( user =>({ 
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        }))
    },
    async create(newUser){
        const db = await Database()
        const data = await db.all(`SELECT email FROM user WHERE email = "${newUser.email}"`)
        
        if(data.length == 0){
            try {
                const db = await Database()
    
                await db.run(`INSERT INTO user (
                    name,
                    email,
                    password, 
                    avatar
                ) VALUES (
                    "${newUser.name}",
                    "${newUser.email}",
                    "${newUser.password}",
                    "${newUser.avatar}"
                )`)
                await db.close()
            } catch (error) {
                console.log(error);
            }
        }else{
            console.log("já existe um usuário com esse email")
            console.log(error);
        }

        
    },
    // async create(newUser){
    //     console.log(newUser)
    //     // const db = await Database()
    //     // const data = await db.all(`SELECT email FROM user WHERE email = "${newUser.email}"`)
    //     const schema = yup.object().shape({
    //         password: yup.string("Erro: Necessário preencher o campo senha!")
    //           .required("Erro: Necessário preencher o campo senha!")
    //           .min(8, "Erro: A senha deve ter no mínimo 6 caracteres!"),
    //         email: yup.string("Erro: Necessário preencher o campo e-mail!")
    //           .required("Erro: Necessário preencher o campo e-mail!")
    //           .email("Erro: Necessário preencher o campo com e-mail válido!"),
    //         name: yup.string("Erro: Necessário preencher o campo nome!")
    //           .required("Erro: Necessário preencher o campo nome!")
    //       });
    //     try{
    //         console.log("oi")
    //         let falha = await schema.validate(newUser);
    //         console.log(falha)
    //     }catch(err){
    //         return res.status(400).json({
    //             erro: true,
    //             message: error.message,
    //             errors: error.inner
    //           })
              
    //     }
    //     return res.json({
    //         erro: false,
    //         mensagem: "Dados corretos!"
    //       });
    //     // if(data.length == 0){
    //     //     try {
    //     //         const db = await Database()
    
    //     //         await db.run(`INSERT INTO user (
    //     //             name,
    //     //             email,
    //     //             password, 
    //     //             avatar
    //     //         ) VALUES (
    //     //             "${newUser.name}",
    //     //             "${newUser.email}",
    //     //             "${newUser.password}",
    //     //             "${newUser.avatar}"
    //     //         )`)
    //     //         await db.close()
    //     //     } catch (error) {
    //     //         console.log(error);
    //     //     }
    //     // }else{
    //     //     console.log("já existe um usuário com esse email")
    //     //     console.log(error);
    //     // }
    async delete(id){
        const db = await Database()

        await db.run(`DELETE FROM user WHERE id = ${id}`)

        await db.close()
    },
    async update(updatedUser, userId) {
        const db = await Database()

        await db.run(`UPDATE user SET
        name = "${updatedUser.name}",
        email = "${updatedUser.email}",
        password = "${updatedUser.password}",
        avatar = "${updatedUser.avatar}"
        WHERE id = ${userId}
      `)

      await db.close()
    },
    async return_info(userEmail){
        const db = await Database()
        const data = await db.all(`SELECT * FROM user WHERE email = "${userEmail}" `)
        console.log(data)
        await db.close()

        return data.map( user =>({ 
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            password: user.password
        }))
    },
    async show(userID){
        const db = await Database()
        const data = await db.all(`SELECT * FROM user WHERE id = "${userID}" `)
        console.log(data)
        await db.close()

        return data.map( user =>({ 
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        }))
    },
}