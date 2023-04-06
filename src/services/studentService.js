const db = require('../config/db');

module.exports = {
  getAllStudents: async () => {
    const students = await db.student.findMany();
    return students;
  },
};
