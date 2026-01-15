const sequelize = require('./database');
const Admin = require('../models/Admin');
const Guest = require('../models/Guest');

module.exports = async function initializeDatabase() {
  try {
    console.log('🔧 Проверка подключения к БД...');
    
    await sequelize.authenticate();
    console.log('✅ Подключение к SQLite успешно');

    console.log('🔄 Синхронизация моделей...');
    // Сначала модели
    await Admin.sync({ alter: true });
    await Guest.sync({ alter: true });
    console.log('✅ Модели синхронизированы');

    // Проверяем и создаем админа
    const adminCount = await Admin.count();
    console.log(`👥 Количество администраторов в БД: ${adminCount}`);
    
    if (adminCount === 0) {
      console.log('👤 Создание администратора по умолчанию...');
      await Admin.create({
        login: 'admin',
        password: 'admin123'
      });
      console.log('✅ Создан администратор по умолчанию');
      console.log('📋 Данные:');
      console.log('   👤 Логин: admin');
      console.log('   🔐 Пароль: admin123');
    } else {
      console.log('✅ Администратор уже существует в БД');
    }

    // Проверяем таблицу guests
    const guestCount = await Guest.count();
    console.log(`👥 Количество гостей в БД: ${guestCount}`);
    
    return true;
  } catch (error) {
    console.error('❌ Ошибка инициализации БД:', error.message);
    console.error('📋 Подробности:', error);
    throw error;
  }
};