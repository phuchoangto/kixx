const EventAlreadyExistsError = require('../errors/eventAlreadyExistsError');
const db = require('../config/db');

module.exports = {
  getAllEvent: async () => {
    const events = await db.event.findMany({
      include: {
        faculty: true,
      },
    });
    return events;
  },

  addEvent: async (name, description, start, end, imageUrl, facultyId) => {
    // check if event already exists
    const eventExists = await db.event.findMany({
      where: {
        name,
      },
    });
    if (eventExists.length > 0) {
      throw new EventAlreadyExistsError('Event already exists');
    }
    const event = await db.event.create({
      data: {
        name,
        description,
        start,
        end,
        imageUrl,
        facultyId,
      },
    });
    return event;
  },
};
