const initializeDatabase = require('./src/config/database.init');
const app = require('./app')
require('dotenv').config();

const PORT = process.env.PORT || 3001;

// Инициализация и запуск сервера
const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
      console.log(`📌 API эндпоинты:`);
      console.log(`   • POST   http://localhost:${PORT}/api/guests/create`);
      console.log(`   • GET    http://localhost:${PORT}/api/guests`);
      console.log(`   • DELETE http://localhost:${PORT}/api/guests/:id`);
      console.log(`   • POST   http://localhost:${PORT}/api/admin/login`);
      console.log(`\n🔐 Тестовый админ: admin / admin123`);
    });
  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error);
    process.exit(1);
  }
};

startServer();