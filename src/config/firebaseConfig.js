const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK with service account key
admin.initializeApp({
  credential: admin.credential.cert(require(process.env.FIREBASE_CONFIG_PATH)),
  storageBucket: 'your-app-id.appspot.com', // Replace with your Firebase Storage bucket name
});

module.exports = admin;
