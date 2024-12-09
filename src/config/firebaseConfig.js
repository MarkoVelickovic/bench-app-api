const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK with service account key
admin.initializeApp({
  credential: admin.credential.cert("bench-app-dd51e-firebase-adminsdk-6ek2i-1ac5b17c93.json"),
  storageBucket: "bench-app-dd51e.firebasestorage.app", // Replace with your Firebase Storage bucket name
  projectId: "bench-app-dd51e"
});

module.exports = admin;
