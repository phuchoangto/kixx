/* eslint-disable object-curly-newline */
const { validationResult } = require('express-validator');
const eventService = require('../services/eventService');
const { addEventValidator } = require('../validator/addEventValidator');
const EventAlreadyExistsError = require('../errors/eventAlreadyExistsError');

module.exports = {
  manageEvent: async (req, res) => {
    const events = await eventService.getAllEvent();
    return res.render('dashboard/events', { title: 'Manage Events', events });
  },

  addEvent: [
    addEventValidator,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(422)
          .json({ errors: errors.array(), message: 'Validation error' });
      }

      const { name, description, start, end, imageUrl, facultyId } = req.body;

      try {
        // eslint-disable-next-line max-len
        const event = await eventService.addEvent(name, description, start, end, imageUrl, facultyId);
        return res.json({ event, message: 'Event added successfully' });
      } catch (error) {
        if (error instanceof EventAlreadyExistsError) {
          return res.status(409).json({ errors: [{ msg: error.message }] });
        }
        return res
          .status(500)
          .json({ errors: [{ msg: 'Internal server error' }] });
      }
    },
  ],
};
