const passport = require('../config/passport');

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
};
