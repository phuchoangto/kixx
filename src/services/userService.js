const db = require('../config/db');

module.exports = {
  getAllUsersWithRoles: async () => {
    const users = await db.user.findMany({
      include: {
        roles: true,
      },
    });
    return users;
  },
};
