const { Product } = require('../models/Product');
const { ProductPrice } = require('../models/ProductPrice');
const { Op } = require('sequelize');

// List all products with optional category filter
const getAllProducts = async (req, res) => {
  const category = req.query.category;
  try {
    const condition = category ? { category } : {};
    const products = await Product.findAll({ where: condition });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  const category = req.params.category;
  try {
    const products = await Product.findAll({ where: { category } });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching category products' });
  }
};

// Search products
const searchProducts = async (req, res) => {
  const q = req.query.q;
  try {
    const products = await Product.findAll({
      where: {
        name: { [Op.like]: `%${q}%` }
      }
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Search failed' });
  }
};

// Get regional price for a product
const getProductPriceByCountry = async (req, res) => {
  const { id, countryCode } = req.params;
  try {
    const price = await ProductPrice.findOne({
      where: { productId: id, countryCode }
    });
    if (!price) return res.status(404).json({ message: 'Price not available for this country' });
    res.json(price);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching product price' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  getProductPriceByCountry
};
