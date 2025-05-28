const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  totalPrice: DataTypes.FLOAT,
  currency: DataTypes.STRING,
  shippingCost: DataTypes.FLOAT,
  tax: DataTypes.FLOAT,
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  paymentMethod: DataTypes.STRING
}, { timestamps: true });

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  orderId: { type: DataTypes.UUID, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false },
  quantity: DataTypes.INTEGER,
  price: DataTypes.FLOAT
}, { timestamps: true });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = { Order, OrderItem };
