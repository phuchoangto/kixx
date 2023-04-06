const { validationResult } = require('express-validator');
const userService = require('../services/userService');
const { addUserValidator } = require('../validator/addUserValidator');
const UserAlreadyExistsError = require('../errors/userAlreadyExistsError');

module.exports = {
  manageUser: async (req, res) => {
    const users = await userService.getAllUsersWithRoles();
    return res.render('dashboard/users', { title: 'Manage Users', users });
  },

  addUser: [
    addUserValidator,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(422)
          .json({ errors: errors.array(), message: 'Validation error' });
      }

      const { username, email, password } = req.body;

      try {
        const user = await userService.addUser(username, email, password);
        return res.json({ user, message: 'User added successfully' });
      } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
          return res.status(409).json({ errors: [{ msg: error.message }] });
        }
        return res
          .status(500)
          .json({ errors: [{ msg: 'Internal server error' }] });
      }
    },
  ],
};
