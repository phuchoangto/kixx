const eventService = require('../services/eventService');

module.exports = {
  index: async (req, res) => {
    const page = req.query.page || 1;
    const limit = 8;
    const { events, total } = await eventService.getUpComingEventsPagination(
      page,
      limit,
    );
    const pages = Math.ceil(total / limit);
    const pagination = {
      page,
      pages,
    };
    console.log(pagination);
    return res.render('home/index', { title: 'Manage Events', events, pagination });
  },
  details: async (req, res) => {
    const { id } = req.params;
    const event = await eventService.getEventById(id);
    return res.render('home/details', { title: 'Manage Events', event });
  },
};
