const { validationResult } = require('express-validator');
const jwtAuthenticated = require('../../middlewares/jwtAuthenticated');
const eventService = require('../../services/eventService');
const EventNotFoundError = require('../../errors/eventNotFoundError');
const StudentNotFoundError = require('../../errors/studentNotFoundError');
const { checkInValidator } = require('../../validators/checkInValidator');

module.exports = {
  getUpcomingEvents: [
    jwtAuthenticated,
    async (req, res) => {
      try {
        const events = await eventService.getUpcomingEvents();
        res.json(events);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
      }
    },
  ],

  checkIn: [
    jwtAuthenticated,
    checkInValidator,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array(), message: 'Validation error' });
        return;
      }
      try {
        const eventId = parseInt(req.params.id, 10);
        let { studentId } = req.body;
        studentId = parseInt(studentId, 10);
        const eventCheckIn = await eventService.checkIn(eventId, studentId);
        res.json(eventCheckIn);
      } catch (err) {
        if (err instanceof EventNotFoundError) {
          res.status(404).json({ message: 'Event not found.' });
        } else if (err instanceof StudentNotFoundError) {
          res.status(404).json({ message: 'Student not found.' });
        } else {
          console.error(err);
          res.status(500).json({ message: 'Internal server error.' });
        }
      }
    },
  ],
};
