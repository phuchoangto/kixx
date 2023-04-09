const express = require('express');
const authController = require('../controllers/api/authController');
const eventController = require('../controllers/api/eventController');
const homeController = require('../controllers/api/homeController');

const router = express.Router();

router.post('/login', authController.login);
router.get('/test', authController.test);

router.get('/events', eventController.getUpcomingEvents);
router.post('/events/:id/checkin', eventController.checkIn);

router.get('/', homeController.index);

module.exports = router;
