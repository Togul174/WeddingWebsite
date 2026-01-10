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
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Имя не может быть пустым'
      },
      len: {
        args: [2, 100],
        msg: 'Имя должно быть от 2 до 100 символов'
      }
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Телефон не может быть пустым'
      }
    }
  }
}, {
  tableName: 'guests',
  timestamps: true, 
  underscored: true, 
  createdAt: 'created_at' ,
  updatedAt: 'updated_at'
});

module.exports = Guest;