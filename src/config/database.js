const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', '..', 'guests.db'), // путь к корню проекта
  logging: console.log,
  define: {
    timestamps: true,
    underscored: false
  }
});

module.exports = sequelize;