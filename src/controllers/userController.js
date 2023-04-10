const { validationResult } = require('express-validator');
const userService = require('../services/userService');
const { addUserValidator } = require('../validators/addUserValidator');
const { editUserValidator } = require('../validators/editUserValidator');
const UserAlreadyExistsError = require('../errors/userAlreadyExistsError');
const UserNotFoundError = require('../errors/userNotFoundError');
const isAdmin = require('../middlewares/isAdmin');

module.exports = {
  manageUser: [
    isAdmin,
    async (req, res) => {
      const users = await userService.getAllUsersWithRoles();
      return res.render('dashboard/users', { title: 'Manage Users', users });
    },
  ],

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

  getUserData: async (req, res) => {
    let { id } = req.params;
    id = parseInt(id, 10);
    try {
      const user = await userService.getUserById(id);
      return res.json({ user });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  editUser: [
    editUserValidator,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(422)
          .json({ errors: errors.array(), message: 'Validation error' });
      }

      const id = parseInt(req.params.id, 10);
      const { username, email, roles } = req.body;

      try {
        const user = await userService.editUser(id, username, email, roles);
        return res.json({ user, message: 'User edited successfully' });
      } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
          return res.status(409).json({ errors: [{ msg: error.message }] });
        }
        if (error instanceof UserNotFoundError) {
          return res.status(404).json({ errors: [{ msg: error.message }] });
        }
        console.log(error);
        return res
          .status(500)
          .json({ errors: [{ msg: 'Internal server error' }] });
      }
    },
  ],
};
