const Guest = require('../models/Guest');

const getAllGuests = async (req, res) => {
  try {
    const guests = await Guest.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.json(guests);
  } catch (error) {
    console.error('Ошибка получения гостей:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка сервера'
    });
  }
};

module.exports = {
  // Создание гостя
  async createGuest(req, res) {
    try {
      console.log('📨 Получены данные гостя:', req.body);

      const { 
        userName, 
        phone, 
        attendance, 
        transferNeeded, 
        hotDish, 
        alcohol, 
        nonAlcohol 
      } = req.body;

      if (!userName || !phone) {
        return res.status(400).json({
          success: false,
          error: 'Имя и телефон обязательны'
        });
      }

      const existingGuest = await Guest.findOne({
        where: { phone: phone.trim() }
      });

      if (existingGuest) {
        return res.status(400).json({
          success: false,
          error: 'Гость с таким телефоном уже зарегистрирован'
        });
      }

      const guest = await Guest.create({
        name: userName.trim(),
        phone: phone.trim(),
        attendance: attendance || '',
        transferNeeded: transferNeeded || '',
        hotDish: hotDish || '',
        alcohol: alcohol || '',
        nonAlcohol: nonAlcohol || ''
      });

      console.log('✅ Гость создан:', guest.name);

      return res.status(201).json({
        success: true,
        message: 'Данные успешно сохранены!',
        guest: {
          id: guest.id,
          name: guest.name,
          phone: guest.phone,
          attendance: guest.attendance,
          transferNeeded: guest.transferNeeded,
          hotDish: guest.hotDish,
          alcohol: guest.alcohol,
          nonAlcohol: guest.nonAlcohol
        }
      });

    } catch (error) {
      console.error('❌ Ошибка при сохранении гостя:', error);
      
      res.status(500).json({
        success: false,
        error: 'Ошибка сервера при сохранении данных'
      });
    }
  },

  // Получение всех гостей
  async getAllGuests(req, res) {
    try {
      const guests = await Guest.findAll({
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        count: guests.length,
        guests: guests.map(guest => ({
          id: guest.id,
          name: guest.name,
          phone: guest.phone,
          attendance: guest.attendance,
          transferNeeded: guest.transferNeeded,
          hotDish: guest.hotDish,
          alcohol: guest.alcohol,
          nonAlcohol: guest.nonAlcohol,
          createdAt: guest.createdAt
        }))
      });

    } catch (error) {
      console.error('Ошибка при получении гостей:', error);
      res.status(500).json({
        success: false,
        error: 'Ошибка при получении списка гостей'
      });
    }
  },

  // Удаление гостя (ДОБАВЬ ЭТОТ МЕТОД!)
  async deleteGuest(req, res) {
    try {
      const { id } = req.params;
      console.log('🗑️ Запрос на удаление гостя ID:', id);

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