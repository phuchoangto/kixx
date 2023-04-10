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
};
