const express = require('express');
const cors = require('cors');
const path = require('path');

// Импорты из src
const sequelize = require('./src/config/database');
const Guest = require('./src/models/Guest'); // для синхронизации
const guestRoutes = require('./src/routes/guest.routes');
const healthRoutes = require('./src/routes/health.routes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Инициализация базы данных
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Подключение к базе данных установлено');
    
    // Синхронизация моделей
    await sequelize.sync({ force: false });
    console.log('✅ База данных синхронизирована');
  } catch (error) {
    console.error('❌ Ошибка подключения к БД:', error);
    process.exit(1);
  }
};

// Регистрация роутов
app.use('/api', healthRoutes);
app.use('/', guestRoutes); // сохраняем существующие пути

// Обработка 404
app.use(errorHandler.notFound);

// Глобальный обработчик ошибок
app.use(errorHandler.globalError);

module.exports = {
  app,
  initializeDatabase
};