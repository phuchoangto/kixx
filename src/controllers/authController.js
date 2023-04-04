const passport = require('../config/passport');

module.exports = {
  login: (req, res) => {
    res.render('auth/login');
  },

  loginPost: (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
      failureFlash: true,
    })(req, res, next);
  },

  logout: (req, res) => {
    req.logout();
    res.redirect('/login');
  },
};
