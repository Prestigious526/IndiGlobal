const express = require('express');
const router = express.Router();

// Dummy route for user profile
router.get('/profile', (req, res) => {
  res.json({ message: 'User profile route works!' });
});

module.exports = router;
