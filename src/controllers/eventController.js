const { validationResult } = require('express-validator');
const eventService = require('../services/eventService');
const facultyService = require('../services/facultyService');
const { addEventValidator } = require('../validators/addEventValidator');
const EventAlreadyExistsError = require('../errors/eventAlreadyExistsError');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const upload = require('../config/upload');

module.exports = {
  manageEvent: async (req, res) => {
    const events = await eventService.getAllEvents();
    return res.render('dashboard/events', { title: 'Manage Events', events });
  },

  addEvent: async (req, res) => {
    const faculties = await facultyService.getAllFaculties();
    return res.render('dashboard/add-event', { title: 'Add Event', faculties });
  },

  addEventPost: [
    upload.single('image'),
    addEventValidator,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(422)
          .json({ errors: errors.array(), message: 'Validation error' });
      }

      if (!req.file) {
        return res.status(400).json({ errors: [{ msg: 'Image is required' }] });
      }

      const {
        name, description, start, end, imageUrl, facultyId,
      } = req.body;
      const image = req.file;

      try {
        const event = await eventService.addEvent(
          name,
          description,
          start,
          end,
          image,
          imageUrl,
          facultyId,
        );
        return res.json({ event, message: 'Event added successfully' });
      } catch (error) {
        if (error instanceof EventAlreadyExistsError) {
          return res.status(409).json({ errors: [{ msg: error.message }] });
        }
        return res.status(500).json({ errors: [{ msg: error.message }] });
      }
    },
  ],

  getCertificate: [
    ensureAuthenticated,
    async (req, res) => {
      const { eventId } = req.params;
      try {
        const pdfBuffer = await eventService.getCertificate(
          eventId,
          req.user.id,
        );
        res.setHeader('Content-Type', 'application/pdf; charset=utf-8');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=certificate.pdf',
        );
        // utf-8
        return res.send(pdfBuffer);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ errors: [{ msg: error.message }] });
      }
    },
  ],
};
