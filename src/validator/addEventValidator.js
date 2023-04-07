const { body } = require('express-validator');

module.exports = {
  addEventValidator: [
    body('name')
      .notEmpty()
      .withMessage('Name is required'),
    body('description')
      .notEmpty()
      .withMessage('Description is required'),
    body('start')
      .notEmpty()
      .withMessage('Start date is required')
      .isDate()
      .withMessage('Start date is invalid')
      .isAfter()
      .withMessage('Start date must be in the future'),
    body('end')
      .notEmpty()
      .withMessage('End date is required')
      .isDate()
      .withMessage('End date is invalid')
      .isAfter()
      .withMessage('End date must be in the future')
      .custom((value, { req }) => {
        if (value < req.body.start) {
          throw new Error('End date must be after start date');
        }
        return true;
      }),
    body('imageUrl')
      .isURL()
      .withMessage('Image URL is invalid'),
    body('facultyId')
      .isInt()
      .withMessage('Faculty is invalid'),
  ],
};
