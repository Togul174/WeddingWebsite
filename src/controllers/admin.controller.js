const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

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
      const admin = await Admin.findOne({ 
        where: { login } 
      });
      
      if (!admin) {
        return res.status(400).json({
          success: false,
          error: 'Неверный логин или пароль'
        });
      }

      // Проверяем пароль прямо здесь
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      
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
        role: admin.role
      };

      res.json({
        success: true,
        message: 'Авторизация успешна',
        user: {
          id: admin.id,
          login: admin.login,
          role: admin.role
        }
      });

    } catch (error) {
      console.error('Ошибка авторизации:', error);
      res.status(500).json({
        success: false,
        error: 'Ошибка сервера при авторизации'
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
  },

  // Если нужно обновить пароль администратора
  updatePassword: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({
          success: false,
          error: 'Не авторизован'
        });
      }

      const { oldPassword, newPassword } = req.body;
      
      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Старый и новый пароль обязательны'
        });
      }

      const admin = await Admin.findByPk(req.session.user.id);

      if (!admin) {
        return res.status(404).json({
          success: false,
          error: 'Администратор не найден'
        });
      }

      // Проверяем старый пароль
      const isOldPasswordValid = await bcrypt.compare(oldPassword, admin.password);
      
      if (!isOldPasswordValid) {
        return res.status(400).json({
          success: false,
          error: 'Неверный старый пароль'
        });
      }

      // Хешируем новый пароль прямо здесь
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      
      // Обновляем пароль
      admin.password = hashedNewPassword;
      await admin.save();

      res.json({
        success: true,
        message: 'Пароль обновлен'
      });

    } catch (error) {
      console.error('Ошибка обновления пароля:', error);
      res.status(500).json({
        success: false,
        error: 'Ошибка сервера'
      });
    }
  }
};

module.exports = adminController;