const bcrypt = require('bcrypt');
const { Role } = require('@prisma/client');
const UserAlreadyExistsError = require('../errors/userAlreadyExistsError');
const db = require('../config/db');

module.exports = {
  getAllStudentsWithRoles: async () => {
    const students = await db.student.findMany({
      include: {
        user: {
          include: {
            roles: true,
          },
        },
        faculty: true,
      },
    });
    return students;
  },

  addStudent: async (
    username,
    email,
    password,
    studentId,
    lastName,
    firstName,
    facultyId,
  ) => {
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
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        roles: {
          create: {
            role: Role.STUDENT,
          },
        },
      },
      include: {
        roles: true,
      },
    });
    // Create new student record
    const newStudent = await db.student.create({
      data: {
        id: parseInt(studentId, 10),
        firstName,
        lastName,
        facultyId: parseInt(facultyId, 10),
        userId: newUser.id,
      },
      include: {
        user: true,
        faculty: true,
      },
    });
    return newStudent;
  },
};
