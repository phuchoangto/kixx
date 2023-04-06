const userService = require('../services/userService');

module.exports = {
  manage: async (req, res) => {
    const users = await userService.getAllUsersWithRoles();
    res.render('dashboard/users', { title: 'Manage Users', users });
  },
};
