const express = require('express');
const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', homeController.index);

router.get('/login', authController.login);
router.post('/login', authController.loginPost);

module.exports = router;
