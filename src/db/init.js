const Database = require("./config")

const initDb = {
    async init(){
        const db = await Database()

        await db.exec(`CREATE TABLE user (
            id varchar PRIMARY KEY,
            name varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            password varchar(255) NULL,
            avatar varchar(255) NOT NULL
        )`);

        await db.close()
    }
}

initDb.init();



