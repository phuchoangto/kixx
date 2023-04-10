const eventService = require('../services/eventService');

module.exports = {
  index: async (req, res) => {
    const events = await eventService.getUpComingEvents();
    return res.render('home/index', { title: 'Manage Events', events });
  },
  detail: async (req, res) => {
    const event = await eventService.getEventById(req.params.id);
    return res.render('home/detail', { title: 'Event Detail', event });
  },
};
