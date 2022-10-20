const Database = require('../db/config')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

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

        const uniqeId = uuid.v4();

        if(data.length == 0){
            try {
                const db = await Database()
    
                await db.run(`INSERT INTO user (
                    id,
                    name,
                    email,
                    password, 
                    avatar
                ) VALUES (
                    "${uniqeId}",
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