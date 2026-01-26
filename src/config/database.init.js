const sequelize = require('./database');
const Admin = require('../models/Admin');
const Guest = require('../models/Guest');
const bcrypt = require('bcryptjs');

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
      
      // Используем переменные окружения или дефолтные значения
      const adminLogin = process.env.ADMIN_LOGIN;
      const adminPassword = process.env.ADMIN_PASSWORD;
      
      // Хешируем пароль
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      await Admin.create({
        login: adminLogin,
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('✅ Создан администратор по умолчанию');
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