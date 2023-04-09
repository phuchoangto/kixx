const jwt = require('jsonwebtoken');
const passport = require('../../config/passport');
const userService = require('../../services/userService');
const jwtAuthenticated = require('../../middlewares/jwtAuthenticated');

module.exports = {
  login: async (req, res, next) => {
    passport.authenticate('local', async (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({ message: 'Authentication failed.' });
      }

      const userInDB = await userService.getUserWithRoles(user.id);
      const roles = userInDB.roles.map((role) => role.role);

      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });

      return res.json({ user: { ...user, roles, token } });
    })(req, res, next);
  },

  test: [
    jwtAuthenticated,
    (req, res) => {
      res.json({ message: 'You are authenticated.' });
    },
  ],
};
