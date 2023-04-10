const { validationResult } = require('express-validator');
const facultyService = require('../services/facultyService');
const { addFacultyValidator } = require('../validators/addFacultyValidator');
const FacultyAlreadyExistsError = require('../errors/facultyAlreadyExistsError');

module.exports = {
  manageFaculty: async (req, res) => {
    const faculties = await facultyService.getAllFaculties();
    res.render('dashboard/faculties', {
      title: 'Manage Faculty',
      faculties,
    });
  },
  addFaculty: [
    addFacultyValidator,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(422)
          .json({ errors: errors.array(), message: 'Validation error' });
      }

      const {
        name,
      } = req.body;

      try {
        const faculty = await facultyService.addFaculty(
          name,
        );
        return res.json({ faculty, message: 'Faculty added successfully' });
      } catch (error) {
        if (error instanceof FacultyAlreadyExistsError) {
          return res.status(409).json({ errors: [{ msg: error.message }] });
        }
        console.log(error);
        return res
          .status(500)
          .json({ errors: [{ msg: 'Internal server error' }] });
      }
    },
  ],
};
