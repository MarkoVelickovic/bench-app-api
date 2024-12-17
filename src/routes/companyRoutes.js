const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/companyController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const { validateCompanyCreation } = require('../validators/companyValidator');

const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to create a new company profile
router.post('/create', authenticateUser, validateCompanyCreation, CompanyController.createCompany);

router.put("/:id/setImage", authenticateUser, upload.single('image'), CompanyController.setCompanyImage);

router.put("/:id/update", authenticateUser, validateCompanyCreation, CompanyController.updateCompany);

// Route to retrieve detailed company information
router.get('/:id', authenticateUser, CompanyController.getCompanyById);

// Route to list all companies (for community/discovery features)
router.get('/', authenticateUser, CompanyController.getAllCompanies);

module.exports = router;
