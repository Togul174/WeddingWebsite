const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

const createDefaultAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ where: { login: 'admin' } });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      
      await Admin.create({
        login: ADMIN_LOGIN,
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('Администратор по умолчанию создан');
      console.log('Логин: admin');
      console.log('Пароль: admin123');
    } else {
      console.log('Администратор уже существует');
    }
  } catch (error) {
    console.error('Ошибка создания администратора:', error);
  }
};

module.exports = createDefaultAdmin;