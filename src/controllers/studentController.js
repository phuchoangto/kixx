const { validationResult } = require('express-validator');
const facultyService = require('../services/facultyService');
const studentService = require('../services/studentService');
const { addUserValidator } = require('../validator/addUserValidator');
const { addStudentValidator } = require('../validator/addStudentValidator');
const UserAlreadyExistsError = require('../errors/userAlreadyExistsError');

module.exports = {
  manageStudent: async (req, res) => {
    const faculties = await facultyService.getAllFaculties();
    const students = await studentService.getAllStudentsWithRoles();
    res.render('dashboard/students', { title: 'Manage Students', students, faculties });
  },

  addStudent: [
    addUserValidator,
    addStudentValidator,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(422)
          .json({ errors: errors.array(), message: 'Validation error' });
      }

      const {
        username, email, password, id, lastName, firstName, facultyId,
      } = req.body;

      try {
        // eslint-disable-next-line max-len
        const student = await studentService.addStudent(username, email, password, id, lastName, firstName, facultyId);
        return res.json({ student, message: 'Student added successfully' });
      } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
          return res.status(409).json({ errors: [{ msg: error.message }] });
        }
        return res
          .status(500)
          .json({ errors: [{ msg: 'Internal server error' }] });
      }
    },
  ],
};
