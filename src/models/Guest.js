const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Guest = sequelize.define('Guest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  attendance: {
    type: DataTypes.STRING,
    allowNull: false
  },
  transferNeeded: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hotDish: {
    type: DataTypes.STRING,
    allowNull: false
  },
  alcohol: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nonAlcohol: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'guests',
  timestamps: true
});

module.exports = Guest;