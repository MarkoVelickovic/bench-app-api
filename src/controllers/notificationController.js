const admin = require('../config/firebaseConfig.js');

/**
 * Controller for notification-related operations.
 */
class NotificationController {
  /**
   * Send notifications to clients.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async sendNotification(req, res) {
    const { userToken, message } = req.body;

    try {
      const payload = {
        notification: {
          title: message.title,
          body: message.body,
        },
      };

      await admin.messaging().sendToDevice(userToken, payload);

      // Optionally, store the notification in Firestore
      const db = admin.firestore();
      await db.collection('notifications').add({
        userId: req.user.uid, // Assuming the sender's user ID is in req.user
        message,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(200).json({ message: 'Notification sent successfully.' });
    } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Retrieve the notifications for the authenticated user.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async getUserNotifications(req, res) {
    const userId = req.user.uid;

    try {
      const db = admin.firestore();
      const notificationsRef = db
        .collection('notifications')
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc');
      const snapshot = await notificationsRef.get();

      const notifications = [];
      snapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() });
      });

      res.status(200).json(notifications);
    } catch (error) {
      console.error('Error retrieving notifications:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = NotificationController;
