const Database = require('../db/config');
const uuid = require('uuid');

module.exports = {
  async get() {
    const db = await Database();
    const data = await db.all(`SELECT * FROM store`);

    await db.close();

    return data.map(store => ({
      id: store.id,
      name: store.name,
      avatar: store.avatar,
    }));
  },

  async create(newStore) {
    const db = await Database();
    const data = await db.all(
      `SELECT name FROM store WHERE name = "${newStore.name}"`,
    );

    if (data.length === 0) {
      const db = await Database();
      const uniqeId = uuid.v4();

      await db.run(
        `INSERT INTO store (
                    id,
                    name,
                    avatar,
                ) VALUES (
                    "${uniqeId}",
                    "${newStore.name}",
                    "${newStore.avatar}"
                )`,
      );
      await db.close();
      return;
    }

    console.log('Já existe uma loja com esse nome!');
  },

  async delete(storeId) {
    const db = await Database();

    await db.run(`DELETE FROM store WHERE id = "${storeId}"`);

    await db.close();
  },

  async update(updatedStore, storeId) {
    const db = await Database();

    await db.run(`UPDATE store SET
        name = "${updatedStore.name}",
        avatar = "${updatedStore.avatar}"
        WHERE id = "${storeId}"
      `);

    await db.close();
  },

  async show(storeId) {
    const db = await Database();
    const data = await db.get(
      `SELECT id, name, email, avatar FROM store WHERE id = "${storeId}"`,
    );
    await db.close();

    return data;
  },

  async getById(storeId) {
    const db = await Database();
    const data = await db.get(`SELECT * FROM store WHERE id = "${storeId}"`);
    await db.close();

    return data;
  },
};
