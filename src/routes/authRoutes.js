const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../validators/authValidator');

// Route for user signup (Company or Client)
router.post('/signup', validateSignup, AuthController.signup);

// Route for user login
router.post('/login', validateLogin, AuthController.login);

module.exports = router;
