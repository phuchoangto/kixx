const { Role } = require('@prisma/client');
const db = require('../config/db');

module.exports = async (req, res, next) => {
  if (req.isAuthenticated()) {
    const user = await db.userRoles.findFirst({
      where: {
        userId: req.user.id,
        role: Role.ADMIN,
      },
    });
    if (user) {
      return next();
    }
  }
  return res.redirect('/login');
};
