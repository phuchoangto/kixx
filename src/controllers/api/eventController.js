const jwtAuthenticated = require('../../middlewares/jwtAuthenticated');
const eventService = require('../../services/eventService');
const EventNotFoundError = require('../../errors/eventNotFoundError');
const StudentNotFoundError = require('../../errors/studentNotFoundError');

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
    async (req, res) => {
      try {
        const eventId = req.params.id;
        const { studentId } = req.body;
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
