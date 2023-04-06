const db = require('../config/db');

module.exports = {
  getAllStudent: async () => {
    const students = await db.student.findMany();
    return students;
  },
};
