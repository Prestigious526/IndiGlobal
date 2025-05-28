const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Product = require('./Product');

const ProductPrice = sequelize.define('ProductPrice', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  productId: { type: DataTypes.UUID, allowNull: false },
  countryCode: DataTypes.STRING,
  currencyCode: DataTypes.STRING,
  price: DataTypes.FLOAT,
  lastUpdated: DataTypes.DATE
}, { timestamps: true });

Product.hasMany(ProductPrice, { foreignKey: 'productId' });
ProductPrice.belongsTo(Product, { foreignKey: 'productId' });

module.exports = ProductPrice;
