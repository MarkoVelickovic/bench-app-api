const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/companyController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const { validateCompanyCreation } = require('../validators/companyValidator');

// Route to create a new company profile
router.post('/create', authenticateUser, validateCompanyCreation, CompanyController.createCompany);

// Route to retrieve detailed company information
router.get('/:id', authenticateUser, CompanyController.getCompanyById);

// Route to list all companies (for community/discovery features)
router.get('/', authenticateUser, CompanyController.getAllCompanies);

module.exports = router;
