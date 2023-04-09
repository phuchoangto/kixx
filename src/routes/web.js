const express = require('express');
const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const userController = require('../controllers/userController');
const eventController = require('../controllers/eventController');

const router = express.Router();

router.get('/', homeController.index);

router.get('/login', authController.login);
router.post('/login', authController.loginPost);
// dashboard
router.get('/dashboard', dashboardController.index);
router.get('/dashboard/users', userController.manageUser);
router.post('/dashboard/users', userController.addUser);
router.get('/dashboard/events', eventController.manageEvent);
router.get('/dashboard/events/add', eventController.manageAddEvent);
router.post('/dashboard/events/add', eventController.addEvent);

module.exports = router;
