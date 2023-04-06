const { body } = require('express-validator');

module.exports = {
  addUserValidator: [
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
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('roles')
      .notEmpty()
      .withMessage('Roles is required')
      .isArray()
      .withMessage('Roles must be an array'),
  ],
};
