const Guest = require('../models/Guest');
const { validateGuestData } = require('../utils/validators');

const guestController = {
  // Создание гостя
  createGuest: async (req, res) => {
    try {
      console.log('📨 POST /create-guest получен:', req.body);
      
      const { phone, name } = req.body;

      // Валидация
      const validation = validateGuestData(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: validation.errors.join(', ')
        });
      }

      // Преобразуем к строке
      const phoneStr = phone.toString().trim();
      const nameStr = name.toString().trim();

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
          createdAt: guest.createdAt // Sequelize автоматически использует getter для created_at
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
  },

  // Получение всех гостей
  getAllGuests: async (req, res) => {
    try {
      console.log('📋 GET /guests получен');
      
      const guests = await Guest.findAll({
        order: [['created_at', 'DESC']] // Используем имя колонки из БД
      });

      res.status(200).json({
        success: true,
        count: guests.length,
        guests: guests.map(guest => ({
          id: guest.id,
          name: guest.name,
          phone: guest.phone,
          createdAt: guest.createdAt // getter вернет значение из created_at
        }))
      });

    } catch (error) {
      console.error('❌ Ошибка при получении гостей:', error);
      
      res.status(500).json({
        success: false,
        error: 'Ошибка при получении списка гостей'
      });
    }
  },

  // Получение гостя по ID
  getGuestById: async (req, res) => {
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
  }
};

module.exports = guestController;