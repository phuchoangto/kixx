const db = require('../config/db');

module.exports = {
  getAllUsers: async () => {
    const users = await db.user.findMany();
    return users;
  },
};
