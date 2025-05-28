const { Cart, CartItem } = require('../models/Cart');
const { Product } = require('../models/Product');
const { sequelize } = require('../config/database');

// Create or get user's cart
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) {
    cart = await Cart.create({ userId });
  }
  return cart;
};

// Add item to cart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const cart = await getOrCreateCart(userId);
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
        price: product.priceINR // base price, currency handled at display
      });
    }

    res.status(200).json({ message: 'Added to cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding to cart' });
  }
};

// Get cart contents
const getCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await getOrCreateCart(userId);
    const items = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [{ model: Product }]
    });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving cart' });
  }
};

// Update item quantity
const updateCartItem = async (req, res) => {
  const { itemId, quantity } = req.body;
  try {
    const item = await CartItem.findByPk(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.quantity = quantity;
    await item.save();
    res.json({ message: 'Cart updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating cart item' });
  }
};

// Remove item
const removeCartItem = async (req, res) => {
  const { itemId } = req.params;
  try {
    await CartItem.destroy({ where: { id: itemId } });
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing item' });
  }
};

// Clear cart
const clearCart = async (userId) => {
  const cart = await Cart.findOne({ where: { userId } });
  if (cart) {
    await CartItem.destroy({ where: { cartId: cart.id } });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getOrCreateCart
};
