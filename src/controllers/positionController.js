const PositionModel = require('../models/positionModel');

/**
 * Controller for position-related operations.
 */
class PositionController {
  /**
   * List available positions within all companies with optional filters.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async getAllPositions(req, res) {
    const filters = req.query; // Extract filters from query parameters

    try {
      const positions = await PositionModel.getAllPositions(filters);
      res.status(200).json(positions);
    } catch (error) {
      console.error('Error retrieving positions:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Create a new job position.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async createPosition(req, res) {
    const positionData = req.body;

    try {
      // Validate and authenticate the company before creating a position
      const positionId = await PositionModel.createPosition(positionData);
      res.status(201).json({
        message: 'Position created successfully.',
        positionId,
      });
    } catch (error) {
      console.error('Error creating position:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Retrieve a job position by ID.
   */
  static async getPositionById(req, res) {
    const { id } = req.params;

    try {
      const position = await PositionModel.getPositionById(id);
      if (!position) {
        return res.status(404).json({ error: 'Position not found' });
      }
      res.status(200).json(position);
    } catch (error) {
      console.error('Error retrieving position:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PositionController;
