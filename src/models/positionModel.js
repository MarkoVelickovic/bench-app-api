const admin = require('../config/firebaseConfig.js');
const db = admin.firestore();

// Reference to the 'positions' collection
const positionsCollection = db.collection('positions');

class PositionModel {
  /**
   * Create a new job position.
   * @param {Object} positionData - The data of the position to create.
   * @returns {Promise<string>} - The ID of the newly created position.
   */
  static async createPosition(positionData) {
    try {
      const positionRef = await positionsCollection.add(positionData);
      return positionRef.id;
    } catch (error) {
      throw new Error(`Error creating position: ${error.message}`);
    }
  }

  /**
   * Retrieve a job position by ID.
   * @param {string} positionId - The ID of the position to retrieve.
   * @returns {Promise<Object>} - The position data.
   */
  static async getPositionById(positionId) {
    try {
      const positionDoc = await positionsCollection.doc(positionId).get();
      if (!positionDoc.exists) {
        throw new Error('Position not found');
      }
      return { id: positionDoc.id, ...positionDoc.data() };
    } catch (error) {
      throw new Error(`Error retrieving position: ${error.message}`);
    }
  }

  /**
   * Update an existing job position.
   * @param {string} positionId - The ID of the position to update.
   * @param {Object} updateData - The data to update.
   * @returns {Promise<void>}
   */
  static async updatePosition(positionId, updateData) {
    try {
      await positionsCollection.doc(positionId).update(updateData);
    } catch (error) {
      throw new Error(`Error updating position: ${error.message}`);
    }
  }

  /**
   * Delete a job position.
   * @param {string} positionId - The ID of the position to delete.
   * @returns {Promise<void>}
   */
  static async deletePosition(positionId) {
    try {
      await positionsCollection.doc(positionId).delete();
    } catch (error) {
      throw new Error(`Error deleting position: ${error.message}`);
    }
  }

  /**
   * Retrieve all job positions with optional filters.
   * @param {Object} filters - Filtering criteria (e.g., requiredSkills, status).
   * @returns {Promise<Array>} - A list of positions matching the criteria.
   */
  static async getAllPositions(filters = {}) {
    try {
      let query = positionsCollection;

      // Apply filters if provided
      if (filters.requiredSkills) {
        query = query.where(
          'requiredSkills',
          'array-contains-any',
          filters.requiredSkills
        );
      }
      if (filters.status) {
        query = query.where('status', '==', filters.status);
      }
      if (filters.companyId) {
        query = query.where('companyId', '==', filters.companyId);
      }

      const snapshot = await query.get();
      const positions = [];
      snapshot.forEach((doc) => {
        positions.push({ id: doc.id, ...doc.data() });
      });
      return positions;
    } catch (error) {
      throw new Error(`Error retrieving positions: ${error.message}`);
    }
  }
}

module.exports = PositionModel;
