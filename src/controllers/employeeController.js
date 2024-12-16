const EmployeeModel = require('../models/employeeModel');
const admin = require('../config/firebaseConfig.js');
const bucket = admin.storage().bucket();
const { v4: uuidv4 } = require('uuid');
const SessionModel = require('../models/sessionModel.js');

/**
 * Controller for employee-related operations.
 */
class EmployeeController {
  /**
   * Add a new employee to the company profile.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async createEmployee(req, res) {
    const employeeData = req.body;

    try {

      if(!(await SessionModel.authorizeCompanyAccess(employeeData.companyId, req.headers.authorization))) {
        return res.status(403).json({error: "Access not authorized."});
      }

      // Add authentication and company ownership verification here
      const employeeId = await EmployeeModel.createEmployee(employeeData);
      res.status(201).json({
        message: 'Employee added successfully.',
        employeeId,
      });
    } catch (error) {
      console.error('Error adding employee:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Retrieve detailed information about an employee.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async getEmployeeById(req, res) {
    const { id } = req.params;

    try {
      const employee = await EmployeeModel.getEmployeeById(id);
      res.status(200).json(employee);
    } catch (error) {
      console.error('Error retrieving employee information:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Upload a CV for an employee.
   * @param {Object} req - Express request object (expects 'file' in req).
   * @param {Object} res - Express response object.
   */
  static async uploadCV(req, res) {
    const { id: employeeId } = req.params;

    try {
      const companyId = await EmployeeModel.getEmployeeById(employeeId)

      if(!SessionModel.authorizeCompanyAccess(companyId, req.headers.authorization)) {
        return res.status(403).json({error: "Access not authorized."});
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      const file = req.file;
      const uniqueFilename = `cv/${employeeId}_${Date.now()}_${file.originalname}`;
      const fileUpload = bucket.file(uniqueFilename);

      // Create a write stream for uploading the file
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
          metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
          },
        },
      });

      blobStream.on('error', (error) => {
        console.error('Error uploading CV:', error);
        res.status(500).json({ error: error.message });
      });

      blobStream.on('finish', async () => {
        // Construct the public URL
        const publicUrl = `${fileUpload.name}`;

        // Update the employee's CV URL in Firestore
        await EmployeeModel.updateEmployee(employeeId, { cvUrl: publicUrl });

        res.status(200).json({
          message: 'CV uploaded successfully.',
          cvUrl: publicUrl,
        });
      });
      
      // Pipe the file to Firebase Storage
      blobStream.end(file.buffer);
    } catch (error) {
      console.error('Error processing CV upload:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Allows clients to download the CV of an employee.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async downloadCV(req, res) {
    const { id: employeeId } = req.params;

    try {
      const employee = await EmployeeModel.getEmployeeById(employeeId);

      if (!employee.cvUrl) {
        return res.status(404).json({ error: 'CV not found for this employee.' });
      }

      // Redirect to the CV's public URL
      res.redirect(employee.cvUrl);
    } catch (error) {
      console.error('Error downloading CV:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getEmployeesByCompany(req, res) {
    const {companyId} = req.query;
    console.log(companyId)

    if(!companyId) {
      return res.status(400).json({error: "Missing company id."})
    }

    try {
     const employeesList = await EmployeeModel.getEmployeesByCompanyId(companyId);

     return res.status(200).json(employeesList);
    }
    catch(error) {
      return res.status(500).json({error: `An error occured: ${error.message}`});
    }
  }
}

module.exports = EmployeeController;
