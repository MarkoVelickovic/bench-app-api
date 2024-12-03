const CompanyModel = require('../models/companyModel');

/**
 * Controller for company-related operations.
 */
class CompanyController {
  /**
   * Create a new company profile.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async createCompany(req, res) {
    const companyData = req.body;

    try {
      // You may add validation and authentication checks here
      const companyId = await CompanyModel.createCompany(companyData);
      res.status(201).json({
        message: 'Company profile created successfully.',
        companyId,
      });
    } catch (error) {
      console.error('Error creating company profile:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Retrieve detailed company information, including employees and services.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async getCompanyById(req, res) {
    const { id } = req.params;

    try {
      const company = await CompanyModel.getCompanyById(id);
      res.status(200).json(company);
    } catch (error) {
      console.error('Error retrieving company information:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Retrieve all companies.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async getAllCompanies(req, res) {
    try {
      const companies = await CompanyModel.getAllCompanies();
      res.status(200).json(companies);
    } catch (error) {
      console.error('Error retrieving companies:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CompanyController;
