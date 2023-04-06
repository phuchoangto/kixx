const bcrypt = require('bcrypt');
const { Role } = require('@prisma/client');
const UserAlreadyExistsError = require('../errors/userAlreadyExistsError');
const db = require('../config/db');

module.exports = {
  getAllUsersWithRoles: async () => {
    const users = await db.user.findMany({
      where: {
        roles: {
          some: {
            role: Role.ADMIN,
          },
        },
      },
      include: {
        roles: true,
      },
    });
    return users;
  },

  addUser: async (username, email, password) => {
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
      throw new UserAlreadyExistsError('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        roles: {
          create: {
            role: Role.ADMIN,
          },
        },
      },
      include: {
        roles: true,
      },
    });
    return user;
  },

  getUserById: async (id) => {
    const user = await db.user.findUnique({
      where: {
        id,
      },
      include: {
        roles: true,
      },
    });
    return user;
  },
};
