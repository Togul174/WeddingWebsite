const { app, initializeDatabase } = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

// Инициализация и запуск сервера
const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`🌐 Основной сайт: http://localhost:${PORT}`);
      console.log(`🔐 API администратора: http://localhost:${PORT}/admin`);
      console.log(`📊 Получить всех гостей: GET http://localhost:${PORT}/admin/guests`);
      console.log(`🔑 Войти как администратор: POST http://localhost:${PORT}/admin/login`);
      console.log(`📝 Создать гостя: POST http://localhost:${PORT}/api/guests/create`);
    });
  } catch (error) {
    console.error('❌ Не удалось запустить сервер:', error);
    process.exit(1);
  }
};

startServer();