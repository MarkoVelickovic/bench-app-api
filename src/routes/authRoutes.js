const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { validateSignup, validateLogin, validateDeleteAccount } = require('../validators/authValidator');
const { authenticateUser } = require('../middlewares/authMiddleware');

// Route for user signup (Company or Client)
router.post('/signup', validateSignup, AuthController.signup);

// Route for user login
router.post('/login', validateLogin, AuthController.login);

router.post("/deleteAccount", authenticateUser, validateDeleteAccount, AuthController.deleteAccount)

module.exports = router;
