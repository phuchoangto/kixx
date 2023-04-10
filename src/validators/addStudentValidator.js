const { body } = require('express-validator');

module.exports = {
  addStudentValidator: [
    body('id')
      .notEmpty()
      .withMessage('Id is required')
      .isLength({ min: 10, max: 10 })
      .withMessage('Id must be at least 10 numbers')
      .isNumeric()
      .withMessage('Id must be numbers'),
    body('lastName')
      .notEmpty()
      .withMessage('Last Name required')
      .matches(/^[A-Za-z\s]+$/)
      .withMessage('Last Name must be letters'),
    body('firstName')
      .notEmpty()
      .withMessage('First Name required')
      .isAlpha()
      .withMessage('First Name must be letters'),
  ],
};
