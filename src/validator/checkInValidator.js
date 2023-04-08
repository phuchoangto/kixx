const { body } = require('express-validator');

module.exports = {
  checkInValidator: [
    body('studentId')
      .isInt()
      .withMessage('Student ID must be a number.')
      .notEmpty()
      .withMessage('Student ID is required.'),
  ],
};
