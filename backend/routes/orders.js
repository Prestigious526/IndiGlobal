const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { createOrder, getOrderHistory } = require('../controllers/orders');

// Protected routes
router.use(authenticate);

// Place an order (checkout)
router.post('/', createOrder);

// Get user's past orders
router.get('/history', getOrderHistory);

module.exports = router;
