const { Product } = require('../models/Product');
const { Order, OrderItem } = require('../models/Orders');
const { v4: uuidv4 } = require('uuid');

// Add a new product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      sku,
      category,
      subcategory,
      priceINR,
      weight,
      dimensions,
      stockQty,
      originRegion,
      isGITagged,
      imageUrl
    } = req.body;

    const product = await Product.create({
      id: uuidv4(),
      name,
      description,
      sku,
      category,
      subcategory,
      priceINR,
      weight,
      dimensions,
      stockQty,
      originRegion,
      isGITagged,
      imageUrl
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

// Update product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

// View all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem }]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();
    res.json({ message: 'Order status updated', status });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus
};
