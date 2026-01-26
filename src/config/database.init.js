const sequelize = require('./database');
const Admin = require('../models/Admin');
const Guest = require('../models/Guest');

module.exports = async function initializeDatabase() {
  try {
    console.log('🔧 Проверка подключения к БД...');
    
    await sequelize.authenticate();
    console.log('✅ Подключение к SQLite успешно');

    console.log('🔄 Синхронизация моделей...');
    await Admin.sync();
    await Guest.sync();
    console.log('✅ Модели синхронизированы');

    // Проверяем и создаем админа
    const adminCount = await Admin.count();
    console.log(`👥 Количество администраторов в БД: ${adminCount}`);
    
    if (adminCount === 0) {
      console.log('👤 Создание администратора по умолчанию...');
      
      // Берем из переменных окружения или используем дефолтные
      await Admin.create({
        login: process.env.ADMIN_LOGIN,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
        isActive: true
      });
      
      console.log('✅ Создан администратор по умолчанию');
      // Просто сообщаем, не показывая данные
      console.log('📋 Данные установлены');
    } else {
      console.log('✅ Администратор уже существует в БД');
    }

    const guestCount = await Guest.count();
    console.log(`👥 Количество гостей в БД: ${guestCount}`);
    
    return true;
  } catch (error) {
    console.error('❌ Ошибка инициализации БД:', error.message);
    throw error;
  }
};