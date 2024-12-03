const { check, validationResult } = require('express-validator');

/**
 * Validation rules for employee creation.
 */
const validateEmployeeCreation = [
  check('name')
    .notEmpty()
    .withMessage('Employee name is required.')
    .trim()
    .escape(),
  check('position')
    .notEmpty()
    .withMessage('Position is required.')
    .trim()
    .escape(),
  check('seniority')
    .notEmpty()
    .withMessage('Seniority level is required.')
    .trim()
    .escape(),
  check('skills')
    .isArray({ min: 1 })
    .withMessage('Skills must be an array with at least one skill.')
    .notEmpty(),
  check('skills.*')
    .isString()
    .withMessage('Each skill must be a string.')
    .trim()
    .escape(),
  check('availability')
    .notEmpty()
    .withMessage('Availability status is required.')
    .isIn(['Available', 'Not Available'])
    .withMessage('Availability must be either "Available" or "Not Available".'),
  check('yearsOfExperience')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Years of experience must be a positive integer.'),
  check('shortDescription')
    .optional()
    .trim()
    .escape(),
  check('availabilityUntil')
    .optional()
    .isISO8601()
    .withMessage('Availability until must be a valid date.'),
  check('contact')
    .optional()
    .isEmail()
    .withMessage('Contact must be a valid email.')
    .normalizeEmail(),
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
  validateEmployeeCreation,
};
