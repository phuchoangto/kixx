const { body } = require('express-validator');

module.exports = {
  addEventValidator: [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('start')
      .notEmpty()
      .withMessage('Start date is required')
      .isISO8601()
      .withMessage('Start date is invalid')
      .isAfter()
      .withMessage('Start date must be in the future'),
    body('end')
      .notEmpty()
      .withMessage('End date is required')
      .isISO8601()
      .withMessage('End date is invalid')
      .isAfter()
      .withMessage('End date must be in the future')
      .custom((value, { req }) => {
        if (value < req.body.start) {
          throw new Error('End date must be after start date');
        }
        return true;
      }),
    body('facultyId').isInt().withMessage('Faculty is invalid'),
  ],
};
