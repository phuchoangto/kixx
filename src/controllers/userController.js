const { validationResult } = require('express-validator');
const userService = require('../services/userService');
const { addUserValidator } = require('../validator/addUserValidator');

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
        return res.status(422).json({ errors: errors.array() });
      }

      const {
        username, email, password, roles,
      } = req.body;

      try {
        const user = await userService.addUser(
          username,
          email,
          password,
          roles,
        );
        return res.json(user);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    },
  ],
};
