const express = require('express');
const session = require('express-session');
const cors = require('cors');
const routes = require('./src/routes');

const app = express();

// Настройка CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Настройка сессий
app.use(session({
  secret: 'wedding-secret-key', 
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  }
}));

app.use(express.json());
app.use('/api', routes);

module.exports = app;