const admin = require('../config/firebaseConfig.js');
const SessionModel = require('./sessionModel.js');
const db = admin.firestore();

// Reference to the 'employees' collection
const employeesCollection = db.collection('employees');

class EmployeeModel {
  /**
   * Add a new employee to a company.
   * @param {Object} employeeData - The data of the employee to add.
   * @returns {Promise<string>} - The ID of the newly added employee.
   */
  static async createEmployee(employeeData) {
    try {
      const employeeRef = await employeesCollection.add(employeeData);
      return employeeRef.id;
    } catch (error) {
      throw new Error(`Error creating employee: ${error.message}`);
    }
  }

  /**
   * Retrieve an employee profile by ID.
   * @param {string} employeeId - The ID of the employee to retrieve.
   * @returns {Promise<Object>} - The employee data.
   */
  static async getEmployeeById(employeeId) {
    try {
      const employeeDoc = await employeesCollection.doc(employeeId).get();
      if (!employeeDoc.exists) {
        throw new Error('Employee not found');
      }
      return { id: employeeDoc.id, ...employeeDoc.data() };
    } catch (error) {
      throw new Error(`Error retrieving employee: ${error.message}`);
    }
  }

  /**
   * Update an existing employee profile.
   * @param {string} employeeId - The ID of the employee to update.
   * @param {Object} updateData - The data to update.
   * @returns {Promise<void>}
   */
  static async updateEmployee(employeeId, updateData) {
    try {
      await employeesCollection.doc(employeeId).update(updateData);
    } catch (error) {
      throw new Error(`Error updating employee: ${error.message}`);
    }
  }

  /**
   * Delete an employee profile.
   * @param {string} employeeId - The ID of the employee to delete.
   * @returns {Promise<void>}
   */
  static async deleteEmployee(employeeId) {
    try {
      await employeesCollection.doc(employeeId).delete();
    } catch (error) {
      throw new Error(`Error deleting employee: ${error.message}`);
    }
  }

  /**
   * Retrieve all employees of a specific company.
   * @param {string} companyId - The ID of the company.
   * @returns {Promise<Array>} - A list of all employees in the company.
   */
  static async getEmployeesByCompanyId(companyId) {
    try {
      const snapshot = await employeesCollection
        .where('companyId', '==', companyId)
        .get();
      const employees = [];
      snapshot.forEach((doc) => {
        employees.push({ id: doc.id, ...doc.data() });
      });
      return employees;
    } catch (error) {
      throw new Error(`Error retrieving employees: ${error.message}`);
    }
  }

  static async deleteEmployee(employeeId) {
    try {
      const employeeRef = await employeesCollection.doc(employeeId);
      
      if(!employeeRef) {
        throw new Error("Employee not found.")
      }

      const results = await employeeRef.delete({exists: true});
    }
    catch(error) {
      throw new Error(`Error deleting employee: ${error.message}`)
    }
  }
}

module.exports = EmployeeModel;
