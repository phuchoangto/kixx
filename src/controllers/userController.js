const userService = require('../services/userService');

module.exports = {
  manage: (req, res) => {
    const users = userService.getAllUsers();
    res.render('dashboard/users', { title: 'Manage Users', users });
  },
};
