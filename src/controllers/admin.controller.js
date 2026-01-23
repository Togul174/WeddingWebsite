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

      // Ищем администратора с учетом активности
      const admin = await Admin.findOne({ 
        where: { 
          login,
          isActive: true // Проверяем активность администратора
        } 
      });
      
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
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt
      };

      // Логируем успешный вход
      console.log(`Admin ${admin.login} logged in at ${new Date().toISOString()}`);

      res.json({
        success: true,
        message: 'Авторизация успешна',
        user: {
          id: admin.id,
          login: admin.login,
          email: admin.email,
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
    const userLogin = req.session.user?.login;
    
    req.session.destroy((err) => {
      if (err) {
        console.error('Ошибка при выходе:', err);
        return res.status(500).json({
          success: false,
          error: 'Ошибка сервера'
        });
      }

      if (userLogin) {
        console.log(`Admin ${userLogin} logged out at ${new Date().toISOString()}`);
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

  // Обновление профиля (опционально)
  updateProfile: async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({
          success: false,
          error: 'Не авторизован'
        });
      }

      const { email } = req.body;
      const admin = await Admin.findByPk(req.session.user.id);

      if (!admin) {
        return res.status(404).json({
          success: false,
          error: 'Администратор не найден'
        });
      }

      admin.email = email || admin.email;
      await admin.save();

      // Обновляем данные в сессии
      req.session.user.email = admin.email;

      res.json({
        success: true,
        message: 'Профиль обновлен',
        user: req.session.user
      });

    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      res.status(500).json({
        success: false,
        error: 'Ошибка сервера'
      });
    }
  }
};

module.exports = adminController;