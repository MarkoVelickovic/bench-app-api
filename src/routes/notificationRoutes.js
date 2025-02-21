const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const { validateNotification } = require('../validators/notificationValidator');

// Route to send a notification
router.post('/send', authenticateUser, validateNotification, NotificationController.sendNotification);

// Route to get notifications for the authenticated user
router.get('/', authenticateUser, NotificationController.getUserNotifications);

module.exports = router;

