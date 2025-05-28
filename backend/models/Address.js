const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Address = sequelize.define('Address', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  label: { type: DataTypes.STRING, allowNull: false },
  line1: { type: DataTypes.STRING, allowNull: false },
  line2: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  postalCode: DataTypes.STRING,
  country: DataTypes.STRING
}, { timestamps: true });

User.hasMany(Address, { foreignKey: 'userId' });
Address.belongsTo(User, { foreignKey: 'userId' });

module.exports = Address;
