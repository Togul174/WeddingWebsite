const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Логин не может быть пустым'
      },
      len: {
        args: [3, 50],
        msg: 'Логин должен быть от 3 до 100 символов'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Пароль не может быть пустым'
      },
      len: {
        args: [6, 100],
        msg: 'Пароль должен быть от 6 до 100 символов'
      }
    }
  },
  // Добавьте дополнительные поля при необходимости
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: {
        msg: 'Некорректный email адрес'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('superadmin', 'admin', 'moderator'),
    defaultValue: 'admin'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'admins',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: async (admin) => {
      if (admin.password) {
        // Используем статический метод для единообразия
        admin.password = await Admin.hashPassword(admin.password);
      }
    },
    beforeUpdate: async (admin) => {
      if (admin.changed('password')) {
        admin.password = await Admin.hashPassword(admin.password);
      }
    }
  }
});

// Метод для проверки пароля
Admin.prototype.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Статический метод для хеширования пароля (удобно для создания админов)
Admin.hashPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Статический метод для создания администратора с проверкой
Admin.createWithHash = async function(adminData) {
  const { login, password, ...rest } = adminData;
  
  // Проверяем, существует ли уже такой логин
  const existingAdmin = await Admin.findOne({ where: { login } });
  if (existingAdmin) {
    throw new Error(`Администратор с логином "${login}" уже существует`);
  }
  
  // Хешируем пароль и создаем администратора
  const hashedPassword = await Admin.hashPassword(password);
  
  return await Admin.create({
    login,
    password: hashedPassword,
    ...rest
  });
};

module.exports = Admin;