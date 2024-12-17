const CompanyModel = require('../models/companyModel');
const SessionModel = require('../models/sessionModel');
const UserModel = require('../models/userModel');
const admin = require("../config/firebaseConfig.js");
const bucket = admin.storage().bucket();

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
      await UserModel.addCompany(companyData.userId, companyId);
      const newUser = await SessionModel.registerSession(companyId, req.headers.authorization)
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

  static async updateCompany(req, res) {
    const companyId = req.params.id;
    const companyData = req.body;

    try {
      if(!(await SessionModel.authorizeCompanyAccess(companyId, req.headers.authorization))) {
        return res.status(403).json({error: "Access not allowed."});
      }
    
      await CompanyModel.updateCompany(companyId, companyData);
      return res.status(200).json({message: "Company updated successfully."})
    }
    catch(error) {
      return res.status(500).json({error: `Error updating company: ${error.message}`})
    }
  }

  static async setCompanyImage(req, res) {
    const companyId = req.params.id;

    try {
      if(!(await SessionModel.authorizeCompanyAccess(companyId, req.headers.authorization))) {
        return res.status(403).json( { error: "Accecss not aurhorized." } )
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      const file = req.file;
      const filename = `image/${companyId}_${Date.now()}_${file.originalname}`;

      const uploadFileRef = bucket.file(filename);

      const writeStream = uploadFileRef.createWriteStream({
        metadata: {
          contentType: file.memetype,
        }
      });

      writeStream.on('finish', () => {
        const publicUrl = `${uploadFileRef.name}`;
        CompanyModel.updateCompany(companyId, { logo: publicUrl });

        return res.status(200).json({
          message: "Image uploaded successfully.",
          imageUrl: publicUrl
        })
      });

      writeStream.end(file.buffer);
    }
    catch(error) {
        return res.status(500).json({
          messagae: `Erro while uploading image: ${error.message}`
        });
    }
  }
}

module.exports = CompanyController;
