// src/config/database.js
const { Sequelize } = require('sequelize');
const path = require('path');

console.log('🔧 Инициализация SQLite базы данных...');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', '..', 'wedding.db'),
  logging: false,
});

module.exports = sequelize;