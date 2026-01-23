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
      const phoneStr = phone.trim();
      const nameStr = name.trim();

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

      return res.status(201).json({
        success: true,
        message: `Гость ${guest.name} был успешно зарегистрирован`,
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
          createdAt: guest.createdAt,
          created_at: guest.createdAt,
          updated_at: guest.updatedAt
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
          createdAt: guest.createdAt,
          created_at: guest.createdAt,
          updated_at: guest.updatedAt
        }
      });
    } catch (error) {
      console.error('Ошибка:', error);
      res.status(500).json({
        success: false,
        error: 'Внутренняя ошибка'
      });
    }
  },

  // Обновление гостя
  updateGuest: async (req, res) => {
    try {
      console.log('🔄 PUT /guests/:id получен:', req.params.id, req.body);
      
      const { id } = req.params;
      const { name, phone } = req.body;

      // Валидация входных данных
      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Имя не может быть пустым'
        });
      }

      if (!phone || !phone.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Телефон не может быть пустым'
        });
      }

      // Проверяем длину имени
      if (name.trim().length < 2 || name.trim().length > 100) {
        return res.status(400).json({
          success: false,
          error: 'Имя должно быть от 2 до 100 символов'
        });
      }

      // Ищем гостя
      const guest = await Guest.findByPk(id);
      if (!guest) {
        return res.status(404).json({ 
          success: false, 
          error: 'Гость не найден' 
        });
      }

      // Проверяем, не занят ли телефон другим гостем
      if (phone !== guest.phone) {
        const existingGuest = await Guest.findOne({
          where: { phone: phone.trim() }
        });
        
        if (existingGuest && existingGuest.id !== parseInt(id)) {
          return res.status(400).json({
            success: false,
            error: 'Телефон уже используется другим гостем'
          });
        }
      }

      // Обновляем данные
      await guest.update({
        name: name.trim(),
        phone: phone.trim()
      });

      console.log('✅ Гость обновлен:', guest.toJSON());

      res.json({
        success: true,
        message: 'Данные гостя успешно обновлены',
        guest: {
          id: guest.id,
          name: guest.name,
          phone: guest.phone,
          created_at: guest.createdAt,
          updated_at: guest.updatedAt
        }
      });
    } catch (error) {
      console.error('❌ Ошибка обновления гостя:', error);
      
      if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(err => err.message).join(', ');
        return res.status(400).json({
          success: false,
          error: `Ошибка валидации: ${messages}`
        });
      }

      res.status(500).json({ 
        success: false, 
        error: 'Ошибка обновления данных гостя' 
      });
    }
  },

  // Удаление гостя
  deleteGuest: async (req, res) => {
    try {
      console.log('🗑️ DELETE /guests/:id получен:', req.params.id);
      
      const { id } = req.params;
      
      // Ищем гостя
      const guest = await Guest.findByPk(id);
      if (!guest) {
        return res.status(404).json({ 
          success: false, 
          error: 'Гость не найден' 
        });
      }

      // Сохраняем имя для сообщения
      const guestName = guest.name;
      
      // Удаляем гостя
      await guest.destroy();

      console.log(`✅ Гость "${guestName}" удален`);

      res.json({
        success: true,
        message: `Гость "${guestName}" успешно удален`
      });
    } catch (error) {
      console.error('❌ Ошибка удаления гостя:', error);
      
      res.status(500).json({ 
        success: false, 
        error: 'Ошибка удаления гостя' 
      });
    }
  }
};

module.exports = guestController;