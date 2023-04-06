const studentServices = require('../services/studentService');

module.exports = {
  manage: async (req, res) => {
    const students = await studentServices.getAllStudents();
    res.render('dashboard/students', { students });
  },
};
