const db = require('../config/db');
const EventNotFoundError = require('../errors/eventNotFoundError');
const StudentNotFoundError = require('../errors/studentNotFoundError');

module.exports = {
  getUpcomingEvents: async () => {
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

    // check if student has already checked in
    const existingCheckIn = await db.eventCheckIn.findFirst({
      where: {
        eventId,
        studentId,
      },
    });
    if (existingCheckIn) {
      return existingCheckIn;
    }

    const eventCheckIn = await db.eventCheckIn.create({
      data: {
        event: {
          connect: {
            id: eventId,
          },
        },
        student: {
          connect: {
            id: studentId,
          },
        },
      },
    });
    return eventCheckIn;
  },
};
