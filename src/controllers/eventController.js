const eventService = require('../services/eventService');

module.exports = {
  manageEvent: async (req, res) => {
    const events = await eventService.getAllEvents();
    return res.render('dashboard/events', { title: 'Manage Events', events });
  },
};
