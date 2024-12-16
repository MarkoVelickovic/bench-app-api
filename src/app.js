const express = require('express');
const admin = require('./config/firebaseConfig'); // Import initialized Firebase Admin
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const positionRoutes = require('./routes/positionRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { validateApp } = require('./validators/authValidator');
const EmployeeController = require('./controllers/employeeController');

// Basic API endpoint for testing
app.get('/', (req, res) => {
  res.send('Hello, bench-app!');
});

app.use(validateApp)

// Apply routes to the app
app.use('/auth', authRoutes);
app.use('/company', companyRoutes);
app.use('/employee', employeeRoutes);
app.use('/positions', positionRoutes);
app.use('/notification', notificationRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;

