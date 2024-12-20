const { check, validationResult } = require('express-validator');

/**
 * Validation rules for company creation.
 */
const validateCompanyCreation = [
  check('name')
    .notEmpty()
    .withMessage('Company name is required.')
    .trim()
    .escape(),
  check('description')
    .optional()
    .trim()
    .escape(),
  check('services')
    .optional()
    .isArray()
    .withMessage('Services must be an array.'),
  check('services.*')
    .optional()
    .isString()
    .withMessage('Each service must be a string.')
    .trim()
    .escape(),
  check('location')
    .optional()
    .trim()
    .escape(),
    check("teamSize")
    .isString()
    .notEmpty(),
  check('industry')
    .optional()
    .trim()
    .escape(),
  check('contact')
    .optional()
    .isEmail()
    .withMessage('Contact must be a valid email.')
    .normalizeEmail(),
  // Additional fields based on updated specs
  check('logo')
    .optional()
    .isURL()
    .withMessage('Logo must be a valid URL.')
    .trim(),
  check('coverImage')
    .optional()
    .isURL()
    .withMessage('Cover image must be a valid URL.')
    .trim(),
  check('yearFounded')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() })
    .withMessage('Year founded must be a valid year.'),
  check('socialLinks')
    .optional()
    .isArray()
    .withMessage('Social links must be an array of URLs.'),
  check('socialLinks.*')
    .optional()
    .isURL()
    .withMessage('Each social link must be a valid URL.')
    .trim(),
  check('industries')
    .optional()
    .isArray()
    .withMessage('Industries must be an array.'),
    check("userId")
    .exists()
    .notEmpty()
    .withMessage("UserId is required."),
  check('industries.*')
    .optional()
    .isString()
    .withMessage('Each industry must be a string.')
    .trim()
    .escape(),
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
  validateCompanyCreation,
};
