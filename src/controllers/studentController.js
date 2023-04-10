const { validationResult } = require('express-validator');
const facultyService = require('../services/facultyService');
const studentService = require('../services/studentService');
const { addUserValidator } = require('../validators/addUserValidator');
const { addStudentValidator } = require('../validators/addStudentValidator');
const UserAlreadyExistsError = require('../errors/userAlreadyExistsError');
const isAdmin = require('../middlewares/isAdmin');

module.exports = {
  manageStudent: [
    isAdmin,
    async (req, res) => {
      const faculties = await facultyService.getAllFaculties();
      const students = await studentService.getAllStudentsWithRoles();
      res.render('dashboard/students', {
        title: 'Manage Students',
        students,
        faculties,
      });
    },
  ],

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
        const student = await studentService.addStudent(
          username,
          email,
          password,
          id,
          lastName,
          firstName,
          facultyId,
        );
        return res.json({ student, message: 'Student added successfully' });
      } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
          return res.status(409).json({ errors: [{ msg: error.message }] });
        }
        console.log(error);
        return res
          .status(500)
          .json({ errors: [{ msg: 'Internal server error' }] });
      }
    },
  ],
  getOneStudent: async (req, res) => {
    const { id } = req.params;
    const student = await studentService.getOneStudent(id);
    res.json(student);
  },
  editStudent: [
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(422)
          .json({ errors: errors.array(), message: 'Validation error' });
      }
      const originId = req.params.id;
      const {
        id, lastName, firstName, facultyId,
      } = req.body;

      try {
        // eslint-disable-next-line max-len
        const student = await studentService.editStudent(originId, id, lastName, firstName, facultyId);
        if (student) {
          return res.json({ student, message: 'Student edited successfully' });
        }
        return res.status(404).json({ errors: [{ msg: 'Student not found' }] });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return res
          .status(500)
          .json({ errors: [{ msg: error.message }] });
      }
    },
  ],
};
