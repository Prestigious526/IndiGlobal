// middleware/error.js

const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler; // ✅ exporting as a function (not object)
