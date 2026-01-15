const express = require('express');
const session = require('express-session');
const routes = require('./src/routes/index');

const app = express();

// Настройка CORS для фронтенда
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Настройка сессий
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'wedding-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false
  }
};

app.use(session(sessionConfig));
app.use(express.json());
app.use(routes);

// // Middleware для проверки авторизации
// const requireAuth = (req, res, next) => {
//   if (req.session && req.session.user) {
//     next();
//   } else {
//     res.status(401).json({
//       success: false,
//       error: 'Требуется авторизация'
//     });
//   }
// };

module.exports = app;