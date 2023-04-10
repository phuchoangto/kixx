const eventService = require('../services/eventService');

module.exports = {
  index: async (req, res) => {
    const events = await eventService.getUpComingEvents();
    return res.render('home/index', { title: 'Manage Events', events });
  },
};
