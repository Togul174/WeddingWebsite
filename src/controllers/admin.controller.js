const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

const adminController = {
  // Создание администратора по умолчанию
  createDefaultAdmin: async () => {
    try {
      const adminExists = await Admin.findOne({ where: { login: 'admin' } });
      
      if (!adminExists) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        await Admin.create({
          login: 'admin',
          password: hashedPassword,
          role: 'admin'
        });
        
        console.log('Администратор по умолчанию создан');
        console.log('Логин: admin');
        console.log('Пароль: admin123');
        return true;
      } else {
        console.log('Администратор уже существует');
        return false;
      }
    } catch (error) {
      console.error('Ошибка создания администратора:', error);
      return false;
    }
  },

  // Вход в систему
  login: async (req, res) => {
    try {
      const { login, password } = req.body;

      if (!login || !password) {
        return res.status(400).json({
          success: false,
          error: 'Логин и пароль обязательны'
        });
      }

      const admin = await Admin.findOne({ where: { login } });
      
      if (!admin) {
        return res.status(400).json({
          success: false,
          error: 'Неверный логин или пароль'
        });
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          error: 'Неверный логин или пароль'
        });
      }

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

  // Обновление пароля администратора
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

      const isOldPasswordValid = await bcrypt.compare(oldPassword, admin.password);
      
      if (!isOldPasswordValid) {
        return res.status(400).json({
          success: false,
          error: 'Неверный старый пароль'
        });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      
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
  },

  // Дополнительные методы (опционально)
  createAdmin: async (req, res) => {
    try {
      if (!req.session.user || req.session.user.role !== 'superadmin') {
        return res.status(403).json({
          success: false,
          error: 'Доступ запрещен'
        });
      }

      const { login, password, role } = req.body;
      
      if (!login || !password) {
        return res.status(400).json({
          success: false,
          error: 'Логин и пароль обязательны'
        });
      }

      const adminExists = await Admin.findOne({ where: { login } });
      
      if (adminExists) {
        return res.status(400).json({
          success: false,
          error: 'Администратор с таким логином уже существует'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newAdmin = await Admin.create({
        login,
        password: hashedPassword,
        role: role || 'admin'
      });

      res.json({
        success: true,
        message: 'Администратор создан',
        admin: {
          id: newAdmin.id,
          login: newAdmin.login,
          role: newAdmin.role
        }
      });

    } catch (error) {
      console.error('Ошибка создания администратора:', error);
      res.status(500).json({
        success: false,
        error: 'Ошибка сервера'
      });
    }
  }
};

module.exports = adminController;