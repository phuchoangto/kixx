const converter = require('json-2-csv');
const db = require('../config/db');
const storageService = require('./storageService');
const EventNotFoundError = require('../errors/eventNotFoundError');
const StudentNotFoundError = require('../errors/studentNotFoundError');

module.exports = {
  getUpComingEvents: async () => {
    const events = await db.event.findMany({
      where: {
        start: {
          gte: new Date(),
        },
      },
      include: {
        faculty: true,
      },
    });
    return events;
  },

  checkIn: async (eventId, studentId) => {
    const event = await db.event.findUnique({
      where: {
        id: eventId,
      },
    });
    if (!event) {
      throw new EventNotFoundError();
    }
    const student = await db.student.findUnique({
      where: {
        id: studentId,
      },
    });
    if (!student) {
      throw new StudentNotFoundError();
    }
    // check if student already checked in
    const eventCheckIn = await db.eventCheckIn.findFirst({
      where: {
        studentId,
        eventId,
      },
    });
    if (eventCheckIn.length > 0) {
      return eventCheckIn;
    }
    const newEventCheckIn = await db.eventCheckIn.create({
      data: {
        student: {
          connect: {
            id: studentId,
          },
        },
        event: {
          connect: {
            id: eventId,
          },
        },
      },
    });
    return newEventCheckIn;
  },

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

  getEventCheckIns: async (id) => {
    const event = await db.event.findUnique({
      where: {
        id: parseInt(id, 10),
      },
      include: {
        checkIns: {
          include: {
            student: true,
            event: true,
          },
        },
      },
    });
    return event.checkIns;
  },

  exportEventCheckIns: async (id) => {
    const event = await db.event.findUnique({
      where: {
        id: parseInt(id, 10),
      },
      include: {
        checkIns: {
          include: {
            student: true,
            event: true,
          },
        },
      },
    });
    const data = event.checkIns.map((checkIn) => {
      const { student } = checkIn;
      return {
        id: student.id,
        name: student.name,
        date: checkIn.createdAt,
      };
    });

    const csv = converter.json2csv(data);

    return csv;
  },
};
