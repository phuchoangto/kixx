module.exports = {
  index: (req, res) => {
    res.send('respond with a resource');
  },

  home: (req, res) => {
    res.render('home');
  },
};
