const admin = require('../config/firebaseConfig.js');
const db = admin.firestore();

// Reference to the 'companies' collection
const companiesCollection = db.collection('companies');

class CompanyModel {
  /**
   * Create a new company profile.
   * @param {Object} companyData - The data of the company to create.
   * @returns {Promise<string>} - The ID of the newly created company.
   */
  static async createCompany(companyData) {
    try {
      const companyRef = await companiesCollection.add(companyData);
      return companyRef.id;
    } catch (error) {
      throw new Error(`Error creating company: ${error.message}`);
    }
  }

  /**
   * Retrieve a company profile by ID.
   * @param {string} companyId - The ID of the company to retrieve.
   * @returns {Promise<Object>} - The company data.
   */
  static async getCompanyById(companyId) {
    try {
      const companyDoc = await companiesCollection.doc(companyId).get();
      if (!companyDoc.exists) {
        throw new Error('Company not found');
      }
      return { id: companyDoc.id, ...companyDoc.data() };
    } catch (error) {
      throw new Error(`Error retrieving company: ${error.message}`);
    }
  }

  /**
   * Update an existing company profile.
   * @param {string} companyId - The ID of the company to update.
   * @param {Object} updateData - The data to update.
   * @returns {Promise<void>}
   */
  static async updateCompany(companyId, updateData) {
    try {
      await companiesCollection.doc(companyId).update(updateData);
    } catch (error) {
      throw new Error(`Error updating company: ${error.message}`);
    }
  }

  /**
   * Delete a company profile.
   * @param {string} companyId - The ID of the company to delete.
   * @returns {Promise<void>}
   */
  static async deleteCompany(companyId) {
    try {
      await companiesCollection.doc(companyId).delete();
    } catch (error) {
      throw new Error(`Error deleting company: ${error.message}`);
    }
  }

  static async updateCompany(comapnyId, companyData) {
    try {
      await companiesCollection.doc(comapnyId).update(companyData);
    }
    catch(error) {
      throw new Error(`Error updating company: ${error.message}`)
    }
  }

  /**
   * Retrieve all companies.
   * @returns {Promise<Array>} - A list of all company profiles.
   */
  static async getAllCompanies() {
    try {
      const snapshot = await companiesCollection.get();
      const companies = [];
      snapshot.forEach((doc) => {
        companies.push({ id: doc.id, ...doc.data() });
      });
      return companies;
    } catch (error) {
      throw new Error(`Error retrieving companies: ${error.message}`);
    }
  }
}

module.exports = CompanyModel;
