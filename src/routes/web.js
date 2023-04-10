const express = require('express');
const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const userController = require('../controllers/userController');
const eventController = require('../controllers/eventController');
const studentController = require('../controllers/studentController');
const facultyController = require('../controllers/facultyController');

const router = express.Router();

router.get('/', homeController.index);
router.get('/events/:id', homeController.details);
router.get('/certificates', eventController.getAllCertificates);

router.get('/login', authController.login);
router.post('/login', authController.loginPost);
// dashboard
router.get('/dashboard', dashboardController.index);
router.post('/dashboard/change-password', dashboardController.changePassword);

router.get('/dashboard/users', userController.manageUser);
router.post('/dashboard/users', userController.addUser);
router.get('/dashboard/users/:id', userController.getUserData);
router.put('/dashboard/users/:id', userController.editUser);

router.get('/dashboard/events', eventController.manageEvent);
router.get('/dashboard/events/add', eventController.addEvent);
router.post('/dashboard/events/add', eventController.addEventPost);
router.get('/dashboard/events/:id/edit', eventController.editEvent);
router.post('/dashboard/events/:id/edit', eventController.editEventPost);
router.get('/dashboard/events/:id/check-in', eventController.checkInList);
router.delete('/dashboard/events/:id', eventController.archiveEvent);
router.get(
  '/dashboard/events/:id/check-in/export',
  eventController.exportCheckInList,
);

router.get('/dashboard/students', studentController.manageStudent);
router.post('/dashboard/students', studentController.addStudent);
router.get('/dashboard/students/:id', studentController.getOneStudent);
router.put('/dashboard/students/:id', studentController.editStudent);

router.get('/certificates/:eventId', eventController.getCertificate);

router.get('/dashboard/faculties', facultyController.manageFaculty);
router.post('/dashboard/faculties', facultyController.addFaculty);
module.exports = router;
