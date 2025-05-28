const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/admin');

// For now, assume any authenticated user is admin.
// In production, add role-based middleware.

router.use(authenticate);

// Product management
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Order management
router.get('/orders', getAllOrders);
router.put('/orders/:orderId/status', updateOrderStatus);

module.exports = router;
