const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'admin'
  }
}, {
  tableName: 'admins',
  timestamps: true
});

// Метод для проверки пароля
Admin.prototype.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Хук для хеширования пароля перед сохранением
Admin.beforeCreate(async (admin) => {
  if (admin.password) {
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);
  }
});

// Хук для хеширования пароля при обновлении
Admin.beforeUpdate(async (admin) => {
  if (admin.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);
  }
});

module.exports = Admin;