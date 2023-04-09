const { validationResult } = require('express-validator');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const { changePasswordValidator } = require('../validators/changePasswordValidator');
const userService = require('../services/userService');

module.exports = {
  index: [
    ensureAuthenticated,
    (req, res) => {
      res.render('dashboard', { title: 'Dashboard' });
    },
  ],

  changePassword: [
    ensureAuthenticated,
    changePasswordValidator,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array(), message: 'Validation error' });
      }

      const { oldPassword, newPassword } = req.body;
      const { id } = req.user;

      try {
        await userService.changePassword(id, oldPassword, newPassword);
        return res.status(200).json({ message: 'Password changed successfully' });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
      }
    },
  ],
};
