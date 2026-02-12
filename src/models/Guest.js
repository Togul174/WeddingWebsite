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
    type: DataTypes.INTEGER,
    allowNull: false
  },
  transferNeeded: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hotDish: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  alcohol: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nonAlcohol: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'guests',
  timestamps: true
});

module.exports = Guest;