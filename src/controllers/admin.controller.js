// controllers/admin.controller.js
const Admin = require('../models/Admin');

const adminController = {
  // Вход в систему
  login: async (req, res) => {
    try {
      const { login, password } = req.body;

      // Валидация
      if (!login || !password) {
        return res.status(400).json({
          success: false,
          error: 'Логин и пароль обязательны'
        });
      }

      // Ищем администратора
      const admin = await Admin.findOne({ where: { login } });
      
      if (!admin) {
        return res.status(400).json({
          success: false,
          error: 'Неверный логин или пароль'
        });
      }

      // Проверяем пароль
      const isPasswordValid = await admin.checkPassword(password);
      
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          error: 'Неверный логин или пароль'
        });
      }

      // Создаем сессию
      req.session.user = {
        id: admin.id,
        login: admin.login,
        createdAt: admin.createdAt
      };

      res.json({
        success: true,
        message: 'Авторизация успешна',
        user: {
          id: admin.id,
          login: admin.login
        }
      });

    } catch (error) {
      console.error('Ошибка авторизации:', error);
      res.status(500).json({
        success: false,
        error: 'Ошибка сервера'
      });
    }
  },

  // Выход из системы
  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Ошибка при выходе:', err);
        return res.status(500).json({
          success: false,
          error: 'Ошибка сервера'
        });
      }

      res.json({
        success: true,
        message: 'Выход выполнен успешно'
      });
    });
  },

  // Получение профиля
  getProfile: (req, res) => {
    if (req.session.user) {
      res.json({
        success: true,
        user: req.session.user
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Не авторизован'
      });
    }
  }
};

module.exports = adminController;