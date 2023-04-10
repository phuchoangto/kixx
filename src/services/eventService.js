const PDFDocument = require('pdfkit');
const converter = require('json-2-csv');
const db = require('../config/db');
const storageService = require('./storageService');
const EventNotFoundError = require('../errors/eventNotFoundError');
const StudentNotFoundError = require('../errors/studentNotFoundError');

module.exports = {
  getAllCheckedInEvents: async (userId) => {
    const user = await db.user.findUnique({
      where: {
        id: parseInt(userId, 10),
      },
      include: {
        student: true,
      },
    });
    if (!user) {
      throw new StudentNotFoundError();
    }
    const checkIns = await db.eventCheckIn.findMany({
      where: {
        studentId: user.student.id,
      },
      include: {
        event: {
          include: {
            faculty: true,
          },
        },
      },
    });
    const events = checkIns.map((checkIn) => checkIn.event);
    return events;
  },

  getUpComingEvents: async () => {
    const events = await db.event.findMany({
      where: {
        start: {
          gte: new Date(),
        },
        isArchived: false,
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
    if (eventCheckIn) {
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
      where: {
        isArchived: false,
      },
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

  getCertificate: async (eventId, userId) => {
    const user = await db.user.findUnique({
      where: {
        id: parseInt(userId, 10),
      },
      include: {
        student: true,
      },
    });

    console.log(user);

    // check if the user has checked in to the event
    const checkIn = await db.eventCheckIn.findFirst({
      where: {
        studentId: user.student.id,
        eventId: parseInt(eventId, 10),
      },
      include: {
        event: true,
        student: true,
      },
    });

    console.log(checkIn);

    if (!checkIn) {
      throw new Error('User has not checked in to the event');
    }

    const doc = new PDFDocument();

    // Define the certificate content
    const eventName = checkIn.event.name;
    const participantName = `${checkIn.student.firstName} ${checkIn.student.lastName}`;

    console.log(eventName, participantName);

    // Set the font
    // doc.font('Helvetica-Bold');
    // vietnamese font times new roman
    doc.font('Times-Roman');

    // Add the content to the PDF document
    doc.fontSize(30).text(eventName, { align: 'center' }).moveDown(2);
    doc
      .fontSize(16)
      .text('This certificate is awarded to', { align: 'center' })
      .moveDown();
    doc.fontSize(25).text(participantName, { align: 'center' }).moveDown(2);
    doc
      .fontSize(16)
      .text(`for attending ${eventName}.`, { align: 'center' })
      .moveDown();
    doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, {
      align: 'right',
      opacity: 0.5,
    });

    // return buffer with utf-8 encoding
    const pdfBuffer = await new Promise((resolve, reject) => {
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);
      doc.end();
    });

    return pdfBuffer;
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

  archiveEvent: async (id) => {
    const event = await db.event.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        isArchived: true,
      },
    });
    return event;
  },
};
