const EventAlreadyExistsError = require('../errors/eventAlreadyExistsError');
const db = require('../config/db');

module.exports = {
  getAllEvents: async () => {
    const events = await db.event.findMany({
      include: {
        faculty: true,
      },
    });
    return events;
  },
};
