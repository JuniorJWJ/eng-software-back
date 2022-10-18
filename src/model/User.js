const Database = require('../db/config')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    async get(){
        const db = await Database()
        const data = await db.all(`SELECT * FROM user`)

        await db.close()

        return data.map( user => user);
    },
    async create(newUser){
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
    async show(userEmail){
        const db = await Database()
        const data = await db.all(`SELECT * FROM user WHERE email = "${userEmail}" `)

        await db.close()

        return data.map( user =>({ 
            id: user.id,
            name: user.name,
            password: user.password,
            email: user.email,
        }))
    },
}