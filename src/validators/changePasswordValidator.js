const { body } = require('express-validator');

module.exports = {
  changePasswordValidator: [
    body('oldPassword').notEmpty().withMessage('Old password is required'),
    body('newPassword')
      .notEmpty()
      .withMessage('New password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('confirmPassword')
      .notEmpty()
      .withMessage('Confirm password is required')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Confirm password does not match');
        }
        return true;
      }),
  ],
};
