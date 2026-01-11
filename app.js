// app.js
const express = require('express');
const session = require('express-session');
const Guest = require('./src/models/Guest');
const Admin = require('./src/models/Admin');
const guestRoutes = require('./src/routes/guest.routes');
const adminRoutes = require('./src/routes/admin.routes');

const app = express();

// Настройка CORS для фронтенда
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Настройка сессий
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'wedding-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false // false для localhost
  }
};

app.use(session(sessionConfig));
app.use(express.json());

// Middleware для проверки авторизации
const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({
      success: false,
      error: 'Требуется авторизация'
    });
  }
};

// Инициализация базы данных (без sequelize импорта - он в моделях)
const initializeDatabase = async () => {
  try {
    // Получаем sequelize из модели
    const sequelize = require('./src/config/database');
    
    await sequelize.authenticate();
    console.log('✅ Подключение к SQLite успешно');

    // Синхронизация моделей
    await sequelize.sync({ alter: true });
    console.log('✅ Модели синхронизированы');

    // Создаем первого админа если нет
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      await Admin.create({
        login: 'admin',
        password: 'admin123'
      });
      console.log('✅ Создан администратор по умолчанию');
      console.log('👤 Логин: admin');
      console.log('🔐 Пароль: admin123');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Ошибка инициализации БД:', error.message);
    throw error;
  }
};

// Роуты
app.use('/api/guests', guestRoutes);
app.use('/admin', adminRoutes);

// Защищенные роуты для админа
app.get('/api/admin/guests', requireAuth, async (req, res) => {
  try {
    const guests = await Guest.findAll({
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      count: guests.length,
      guests: guests.map(guest => ({
        id: guest.id,
        name: guest.name,
        phone: guest.phone,
        created_at: guest.createdAt,
        updated_at: guest.updatedAt
      }))
    });
  } catch (error) {
    console.error('Ошибка получения гостей:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка получения списка гостей'
    });
  }
});

// Проверка здоровья сервера
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Wedding Website API'
  });
});

module.exports = { app, initializeDatabase };