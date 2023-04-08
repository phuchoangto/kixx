const { body } = require('express-validator');

module.exports = {
  editUserValidator: [
    body('username')
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 6 })
      .withMessage('Username must be at least 6 characters'),
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email is invalid'),
    body('roles')
      .notEmpty()
      .withMessage('Roles is required'),
  ],
};
