const bcrypt = require('bcrypt');
const { Role } = require('@prisma/client');
const UserAlreadyExistsError = require('../errors/userAlreadyExistsError');
const UserNotFoundError = require('../errors/userNotFoundError');
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

  editUser: async (id, username, email, roles) => {
    const rolesArray = roles.split(',').map((role) => role.trim());
    // check user id exists
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new UserNotFoundError('User not found');
    }

    // check if username or email already exists
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
        NOT: {
          id,
        },
      },
    });
    if (userExists.length > 0) {
      throw new UserAlreadyExistsError('User already exists');
    }

    // remove all previous roles
    await db.userRoles.deleteMany({
      where: {
        userId: id,
      },
    });
    // add new roles
    const newRoles = rolesArray.map((role) => ({
      userId: id,
      role,
    }));
    await db.userRoles.createMany({
      data: newRoles,
    });

    // update user
    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        username,
        email,
      },
      include: {
        roles: true,
      },
    });
    return updatedUser;
  },
};
