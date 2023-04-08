/* eslint-disable object-curly-newline */
const { validationResult } = require('express-validator');
const eventService = require('../services/eventService');
const { addEventValidator } = require('../validator/addEventValidator');
const EventAlreadyExistsError = require('../errors/eventAlreadyExistsError');

module.exports = {
  manageEvent: async (req, res) => {
    const events = await eventService.getAllEvents();
    return res.render('dashboard/events', { title: 'Manage Events', events });
  },

};
