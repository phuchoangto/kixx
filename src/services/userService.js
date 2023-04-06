const bcrypt = require('bcrypt');
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

  addUser: async (username, email, password, roles) => {
    // check if user already exists
    const userExists = await db.user.findMany({
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
    });
    if (userExists.length > 0) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        roles: {
          create: roles.map((role) => ({ role })),
        },
      },
      include: {
        roles: true,
      },
    });
    return user;
  },
};
