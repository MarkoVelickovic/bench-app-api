const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/employeeController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const { validateEmployeeCreation } = require('../validators/employeeValidator');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to add a new employee
router.post('/create', authenticateUser, validateEmployeeCreation, EmployeeController.createEmployee);

router.get('/getEmployeeByCompany', authenticateUser, EmployeeController.getEmployeesByCompany)

// Route to retrieve detailed information about an employee
router.get('/:id', authenticateUser, EmployeeController.getEmployeeById);

// Route to upload a CV for an employee
router.post('/:id/uploadCV', authenticateUser, upload.single('cv'), EmployeeController.uploadCV);

// Route to download an employee's CV
router.get('/:id/downloadCV', authenticateUser, EmployeeController.downloadCV);

router.delete("/:id", authenticateUser, EmployeeController.deleteEmployee);

module.exports = router;
