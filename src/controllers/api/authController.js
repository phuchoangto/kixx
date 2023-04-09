const jwt = require('jsonwebtoken');
const passport = require('../../config/passport');
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

      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      return res.json({ token });
    })(req, res, next);
  },

  test: [
    jwtAuthenticated,
    (req, res) => {
      res.json({ message: 'You are authenticated.' });
    },
  ],
};
