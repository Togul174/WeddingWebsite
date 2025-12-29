const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Инициализация Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'guests.db'),
  logging: console.log
});

// Определение модели Guest
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
  timestamps: true
});

// Синхронизация с базой данных
sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ База данных синхронизирована');
  })
  .catch(err => {
    console.error('❌ Ошибка синхронизации БД:', err);
  });

// ========== РОУТЫ ==========

// Роут для создания гостя (POST /create-guest)
app.post('/create-guest', async (req, res) => {
  console.log('📨 POST /create-guest получен:', req.body);
  
  try {
    const { phone, name } = req.body;

    // Валидация
    if (!phone || !name) {
      return res.status(400).json({
        success: false,
        error: 'Поля phone и name обязательны'
      });
    }

    // Преобразуем к строке
    const phoneStr = phone.toString().trim();
    const nameStr = name.toString().trim();

    if (phoneStr.length === 0 || nameStr.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Поля не могут быть пустыми'
      });
    }

    // Проверяем, существует ли уже гость
    const existingGuest = await Guest.findOne({
      where: { phone: phoneStr }
    });

    if (existingGuest) {
      return res.status(400).json({
        success: false,
        error: `Гость с телефоном ${phoneStr} уже зарегистрирован`
      });
    }

    // Создаем гостя
    const guest = await Guest.create({
      name: nameStr,
      phone: phoneStr
    });

    console.log('✅ Гость создан:', guest.toJSON());

    res.status(201).json({
      success: true,
      message: `Гость ${guest.name} был успешно зарегистрирован`,
      guest: {
        id: guest.id,
        name: guest.name,
        phone: guest.phone,
        createdAt: guest.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Ошибка при создании гостя:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message).join(', ');
      return res.status(400).json({
        success: false,
        error: `Ошибка валидации: ${messages}`
      });
    }

    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// Роут для получения всех гостей (GET /guests)
app.get('/guests', async (req, res) => {
  try {
    console.log('📋 GET /guests получен');
    
    const guests = await Guest.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: guests.length,
      guests: guests.map(guest => ({
        id: guest.id,
        name: guest.name,
        phone: guest.phone,
        createdAt: guest.createdAt
      }))
    });

  } catch (error) {
    console.error('❌ Ошибка при получении гостей:', error);
    
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении списка гостей'
    });
  }
});

// Тестовый роут для проверки
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Сервер работает',
    timestamp: new Date().toISOString(),
    endpoints: {
      createGuest: 'POST /create-guest',
      getGuests: 'GET /guests'
    }
  });
});

// Роут для получения гостя по ID (опционально)
app.get('/guests/:id', async (req, res) => {
  try {
    const guest = await Guest.findByPk(req.params.id);
    
    if (!guest) {
      return res.status(404).json({
        success: false,
        error: 'Гость не найден'
      });
    }

    res.json({
      success: true,
      guest: {
        id: guest.id,
        name: guest.name,
        phone: guest.phone,
        createdAt: guest.createdAt
      }
    });
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка'
    });
  }
});

// Обработка 404 - используем регулярное выражение вместо '*'
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Маршрут не найден',
    path: req.path
  });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error('🔥 Глобальная ошибка:', err);
  
  res.status(500).json({
    success: false,
    error: 'Внутренняя ошибка сервера'
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`🌐 API доступен по адресу: http://localhost:${PORT}`);
  console.log(`📊 Проверка здоровья: http://localhost:${PORT}/api/health`);
  console.log(`👥 Получить всех гостей: GET http://localhost:${PORT}/guests`);
  console.log(`➕ Создать гостя: POST http://localhost:${PORT}/create-guest`);
});