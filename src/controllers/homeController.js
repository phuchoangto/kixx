const eventService = require('../services/eventService');

module.exports = {
  index: async (req, res) => {
    const events = await eventService.getUpComingEvents();
    return res.render('home/index', { title: 'Manage Events', events });
  },
  details: async (req, res) => {
    const { id } = req.params;
    const event = await eventService.getEventById(id);
    return res.render('home/details', { title: 'Manage Events', event });
  },
};
