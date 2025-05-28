const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  sku: { type: DataTypes.STRING, unique: true },
  category: DataTypes.STRING,
  subcategory: DataTypes.STRING,
  priceINR: DataTypes.FLOAT,
  weight: DataTypes.FLOAT,
  dimensions: DataTypes.STRING,
  stockQty: DataTypes.INTEGER,
  originRegion: DataTypes.STRING,
  isGITagged: DataTypes.BOOLEAN,
  imageUrl: DataTypes.STRING
}, { timestamps: true });

module.exports = Product;
