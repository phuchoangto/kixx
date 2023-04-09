const db = require('../config/db');

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
};
