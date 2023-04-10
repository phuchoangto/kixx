const db = require('../config/db');
const storageService = require('./storageService');

module.exports = {
  getAllEvents: async () => {
    const events = await db.event.findMany({
      include: {
        faculty: true,
      },
    });
    return events;
  },

  addEvent: async (
    name,
    description,
    start,
    end,
    image,
    imageUrl,
    facultyId,
  ) => {
    const fileExtension = image.originalname.split('.').pop();
    const fileName = `${Date.now()}.${fileExtension}`;
    const publicUrl = await storageService.uploadFile(image, fileName);
    const startDateTime = new Date(start);
    const endDateTime = new Date(end);
    const event = await db.event.create({
      data: {
        name,
        description,
        start: startDateTime,
        end: endDateTime,
        imageUrl: publicUrl,
        faculty: {
          connect: {
            id: parseInt(facultyId, 10),
          },
        },
      },
    });
    return event;
  },

  getEventById: async (id) => {
    const event = await db.event.findUnique({
      where: {
        id: parseInt(id, 10),
      },
      include: {
        faculty: true,
      },
    });
    return event;
  },

  editEvent: async (id, name, description, start, end, image, facultyId) => {
    // current event
    const event = await db.event.findUnique({
      where: {
        id,
      },
    });
    // if image is not changed
    let publicUrl = event.imageUrl;
    if (image) {
      const fileExtension = image.originalname.split('.').pop();
      const fileName = `${Date.now()}.${fileExtension}`;
      publicUrl = await storageService.uploadFile(image, fileName);
    }
    const startDateTime = new Date(start);
    const endDateTime = new Date(end);
    const updatedEvent = await db.event.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        start: startDateTime,
        end: endDateTime,
        imageUrl: publicUrl,
        faculty: {
          connect: {
            id: parseInt(facultyId, 10),
          },
        },
      },
    });
    return updatedEvent;
  },
};
