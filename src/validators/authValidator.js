const { check, validationResult, header } = require('express-validator');

/**
 * Validation rules for user signup.
 */
const validateSignup = [
  check('email')
    .isEmail()
    .withMessage('A valid email is required.')
    .normalizeEmail(),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  check('userType')
    .isIn(['company', 'client'])
    .withMessage('User type must be either "company" or "client".'),
  check('displayName')
    .notEmpty()
    .withMessage('Display name is required.')
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

/**
 * Validation rules for user login.
 */
const validateLogin = [
  check('email')
    .isEmail()
    .withMessage('A valid email is required.')
    .normalizeEmail(),
  check('password')
    .notEmpty()
    .withMessage('Password is required.'),
  // Middleware to handle validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

/**
 * Validation rules App access.
 */

const validateApp = [
  header("app")
  .notEmpty()
  .withMessage("App access token is required!")
  .isIn([process.env.APP_ACCESS_TOKEN])
  .withMessage("App access token not valid!"),
   // Middleware to handle validation results
   (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    next();
   }
]

module.exports = {
  validateSignup,
  validateLogin,
  validateApp
};
