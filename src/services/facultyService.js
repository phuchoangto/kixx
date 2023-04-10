const db = require('../config/db');
const FacultyAlreadyExistsError = require('../errors/facultyAlreadyExistsError');

module.exports = {
  getAllFaculties: async () => {
    const faculties = await db.faculty.findMany();
    return faculties;
  },

  getFacultyById: async (id) => {
    const faculty = await db.faculty.findOne({
      where: {
        id: parseInt(id, 10),
      },
    });
    return faculty;
  },

  addFaculty: async (name) => {
    // check if faculty already exists
    const facultyExists = await db.faculty.findUnique({
      where: {
        name,
      },
    });
    if (facultyExists) {
      throw new FacultyAlreadyExistsError('Faculty already exists');
    }
    const faculty = await db.faculty.create({
      data: {
        name,
      },
    });
    return faculty;
  },
};
