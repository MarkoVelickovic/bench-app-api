const { AuthClientErrorCode } = require('firebase-admin/auth');
const  admin  = require('../config/firebaseConfig.js');

const jwt = require("jsonwebtoken");
const AuthController = require('../controllers/authController.js');

/**
 * Middleware to authenticate users using Firebase Auth tokens.
 */
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const backHeader = req.headers.authback;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    let decodedToken
    try {
    decodedToken = await admin.auth().verifyIdToken(token);
    }
    catch(err) {
      if(jwt.verify(backHeader,  AuthController.JWT_S_PART + token)) {
        decodedToken = token;
      }
    }
    req.user = decodedToken; // Attach user info to request
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = {
  authenticateUser,
};
