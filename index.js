const { app, initializeDatabase } = require('./app'); // теперь импорт из ./app

const PORT = process.env.PORT || 3001;

// Инициализация и запуск сервера
const startServer = async () => {
  try {
    // Инициализация базы данных
    await initializeDatabase();

    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`🌐 API доступен по адресу: http://localhost:${PORT}`);
      console.log(`📊 Проверка здоровья: http://localhost:${PORT}/api/health`);
      console.log(`👥 Получить всех гостей: GET http://localhost:${PORT}/guests`);
      console.log(`➕ Создать гостя: POST http://localhost:${PORT}/create-guest`);
    });
  } catch (error) {
    console.error('❌ Не удалось запустить сервер:', error);
    process.exit(1);
  }
};

startServer();