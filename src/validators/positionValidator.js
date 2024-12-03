const { check, validationResult } = require('express-validator');

/**
 * Validation rules for position creation.
 */
const validatePositionCreation = [
  check('jobTitle')
    .notEmpty()
    .withMessage('Job title is required.')
    .trim()
    .escape(),
  check('requiredSkills')
    .isArray({ min: 1 })
    .withMessage('Required skills must be an array with at least one skill.')
    .notEmpty(),
  check('requiredSkills.*')
    .isString()
    .withMessage('Each required skill must be a string.')
    .trim()
    .escape(),
  check('status')
    .notEmpty()
    .withMessage('Status is required.')
    .isIn(['Open', 'Closed'])
    .withMessage('Status must be either "Open" or "Closed".'),
  // Assuming companyId comes from authenticated user, but if it's in the body:
  check('companyId')
    .optional()
    .isString()
    .withMessage('Company ID must be a string.'),
  check('createdAt')
    .optional()
    .isISO8601()
    .withMessage('Creation date must be a valid date.'),
  // Middleware to handle validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validatePositionCreation,
};
