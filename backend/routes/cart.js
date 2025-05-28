const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem
} = require('../controllers/cart');

// All routes below are protected
router.use(authenticate);

// Add item to cart
router.post('/add', addToCart);

// Get current user's cart
router.get('/', getCart);

// Update quantity of a cart item
router.put('/update', updateCartItem);

// Remove item from cart
router.delete('/remove/:itemId', removeCartItem);

module.exports = router;
