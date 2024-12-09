const admin = require('../config/firebaseConfig.js');
const axios = require('axios');

/**
 * Controller for authentication operations.
 */
class AuthController {
  /**
   * Register a new user (Company or Client).
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async signup(req, res) {
    const { email, password, userType, displayName } = req.body;

    if (!email || !password || !userType) {
      return res.status(400).json({ error: 'Email, password, and userType are required.' });
    }

    try {
      // Create a new user with Firebase Authentication
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName,
      });

      // Assign custom claims based on userType ('company' or 'client')
      await admin.auth().setCustomUserClaims(userRecord.uid, { userType });

      // Generate a custom token for the new user
      const customToken = await admin.auth().createCustomToken(userRecord.uid);

      res.status(201).json({
        message: 'User registered successfully.',
        token: customToken,
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Log in a user and issue an authentication token.
   * Note: Firebase Admin SDK doesn't support email/password login directly.
   * We'll use Firebase Authentication REST API for this purpose.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async login(req, res) {
    const { email, password } = req.body;
    const firebaseApiKey = process.env.FIREBASE_API_KEY; // Ensure this is set in your .env file

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
      // Use Firebase Authentication REST API to log in the user
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      );

      const { idToken } = response.data;

      res.status(200).json({
        message: 'User logged in successfully.',
        token: idToken,
      });
    } catch (error) {
      console.error('Error logging in user:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: error.response ? error.response.data.error.message : error.message });
    }
  }
}

module.exports = AuthController;
