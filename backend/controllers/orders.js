const { Order, OrderItem } = require('../models/Orders');
const { CartItem, Cart } = require('../models/Cart');
const { Product } = require('../models/Product');
const { clearCart } = require('./cart');
const { v4: uuidv4 } = require('uuid');

// Mock utility: In production, use real APIs or a `services/` layer
const calculateShippingCost = (totalWeight, country) => {
  const ratePerKg = {
    US: 8.0,
    UK: 7.5,
    AE: 6.0
  };
  return (ratePerKg[country] || 10.0) * totalWeight;
};

const calculateTax = (amount, country) => {
  const taxRates = {
    US: 7.5,
    UK: 5.0,
    AE: 0.0
  };
  const rate = taxRates[country] || 10.0;
  return (amount * rate) / 100;
};

const createOrder = async (req, res) => {
  const userId = req.user.id;
  const userCountry = req.user.country || 'US'; // fallback
  try {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(400).json({ message: 'Cart not found' });

    const items = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [Product]
    });

    if (!items.length) return res.status(400).json({ message: 'Cart is empty' });

    let totalAmount = 0;
    let totalWeight = 0;

    const orderItems = items.map(item => {
      const product = item.Product;
      const itemTotal = item.quantity * product.priceINR;
      totalAmount += itemTotal;
      totalWeight += product.weight * item.quantity;

      return {
        id: uuidv4(),
        productId: product.id,
        quantity: item.quantity,
        price: product.priceINR
      };
    });

    const shippingCost = calculateShippingCost(totalWeight, userCountry);
    const tax = calculateTax(totalAmount, userCountry);
    const finalAmount = totalAmount + shippingCost + tax;

    const order = await Order.create({
      userId,
      totalPrice: finalAmount,
      currency: 'INR', // could convert to USD, AED, etc.
      shippingCost,
      tax,
      status: 'processing',
      paymentMethod: 'COD' // or Stripe, Razorpay, etc.
    });

    for (const item of orderItems) {
      item.orderId = order.id;
      await OrderItem.create(item);

      // Optional: decrement stock
      const product = await Product.findByPk(item.productId);
      if (product) {
        product.stockQty -= item.quantity;
        await product.save();
      }
    }

    await clearCart(userId);

    res.status(201).json({ message: 'Order placed successfully', orderId: order.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to place order' });
  }
};

// View past orders
const getOrderHistory = async (req, res) => {
  const userId = req.user.id;
  try {
    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem }]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch order history' });
  }
};

module.exports = { createOrder, getOrderHistory };
