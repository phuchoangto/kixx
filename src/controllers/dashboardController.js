const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

module.exports = {
  index: [
    ensureAuthenticated,
    (req, res) => {
      res.render('dashboard', { title: 'Dashboard' });
    },
  ],
};
