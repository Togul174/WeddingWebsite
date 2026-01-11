// routes/admin.routes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Публичные роуты
router.post('/login', adminController.login);
router.post('/logout', adminController.logout);
router.get('/profile', adminController.getProfile);

module.exports = router;