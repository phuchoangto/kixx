const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const jwtAuthenticated = require('../middlewares/jwtAuthenticated');

module.exports = {
  login: (req, res) => {
    const messages = req.flash('error');
    messages.forEach((message) => {
      console.log(message);
    });
    res.render('auth/login', { messages });
  },

  loginPost: (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true,
    })(req, res, next);
  },

  logout: (req, res) => {
    req.logout();
    res.redirect('/login');
  },

  apiLogin: async (req, res, next) => {
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

  apiTest: [
    jwtAuthenticated,
    (req, res) => {
      res.json({ message: 'You are authenticated.' });
    },
  ],
};
