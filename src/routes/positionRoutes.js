const express = require('express');
const router = express.Router();
const PositionController = require('../controllers/positionController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const { validatePositionCreation } = require('../validators/positionValidator');

// Route to create a new position
router.post('/create', authenticateUser, validatePositionCreation, PositionController.createPosition);

// Route to list available positions with optional filters
router.get('/', authenticateUser, PositionController.getAllPositions);

// Route to get a specific position by ID
router.get('/:id', authenticateUser, PositionController.getPositionById);

module.exports = router;
