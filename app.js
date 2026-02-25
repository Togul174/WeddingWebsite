const express = require('express');
const session = require('express-session');
const cors = require('cors');
const routes = require('./src/routes');

const app = express();

// Настройка CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Настройка сессий
app.use(session({
  secret: process.env.SESSION_SECRET || 'wedding-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

app.use(express.json());
app.use('/api', routes);

module.exports = app;