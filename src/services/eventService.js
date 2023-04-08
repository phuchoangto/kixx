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

  addEvent: async (name, description, start, end, imageUrl, facultyId) => {
    const eventExists = await db.event.findMany({
      where: {
        name,
      },
    });
    if (eventExists.length > 0) {
      throw new EventAlreadyExistsError('Event already exists');
    }
    const startDateTime = new Date(start);
    const endDateTime = new Date(end);
    const event = await db.event.create({
      data: {
        name,
        description,
        start: startDateTime,
        end: endDateTime,
        imageUrl,
        faculty: {
          connect: {
            id: parseInt(facultyId, 10),
          },
        },
      },
    });
    return event;
  },

};
