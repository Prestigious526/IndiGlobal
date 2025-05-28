const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  getProductPriceByCountry
} = require('../controllers/products');

// Public product endpoints
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

// Get location-specific price
router.get('/:id/price/:countryCode', getProductPriceByCountry);

module.exports = router;
