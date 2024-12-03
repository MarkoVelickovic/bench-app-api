/**
 * Centralized error handling middleware.
 */
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
};

module.exports = errorHandler;
