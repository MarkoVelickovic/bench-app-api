const { check, validationResult } = require('express-validator');

/**
 * Validation rules for sending notifications.
 */
const validateNotification = [
  check('userToken')
    .notEmpty()
    .withMessage('User token is required.')
    .isString()
    .withMessage('User token must be a string.'),
  check('message')
    .notEmpty()
    .withMessage('Message object is required.')
    .isObject()
    .withMessage('Message must be an object.'),
  check('message.title')
    .notEmpty()
    .withMessage('Message title is required.')
    .trim()
    .escape(),
  check('message.body')
    .notEmpty()
    .withMessage('Message body is required.')
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
  validateNotification,
};
