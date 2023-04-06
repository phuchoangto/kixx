const studentServices = require('../studentServices/studentManage');

module.exports = {
  studentList: async (req, res) => {
    const students = await studentServices.getAllStudent();
    res.render('dashboard/students', { student: students });
  },
};
