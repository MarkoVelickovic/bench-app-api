const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK with service account key
admin.initializeApp({
  credential: admin.credential.cert(require(process.env.FIREBASE_CONFIG_PATH)),
  storageBucket: "bench-app-dd51e.firebasestorage.app", // Replace with your Firebase Storage bucket name
  projectId: "bench-app-dd51e"
});

module.exports = admin;
