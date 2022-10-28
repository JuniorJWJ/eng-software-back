const Database = require('./config');

module.exports = {
  async init() {
    const db = await Database();

    await db.exec(`
      CREATE TABLE IF NOT EXISTS user (
      id varchar PRIMARY KEY,
      name varchar(255) NOT NULL,
      email varchar(255) NOT NULL,
      password varchar(255) NULL,
      avatar varchar(255) NOT NULL
    )`);

    await db.close();
  },
};
