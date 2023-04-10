const { body } = require('express-validator');

module.exports = {
  addFacultyValidator: [
    body('name').notEmpty().withMessage('Name is required'),
  ],
};
