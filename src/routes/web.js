const express = require('express');
const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', homeController.index);

router.get('/login', authController.login);
router.post('/login', authController.loginPost);

router.get('/dashboard', dashboardController.index);
router.get('/dashboard/users', userController.manage);

module.exports = router;
