const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health.controller');

console.log('Health controller методы:', Object.keys(healthController));

router.get('/health', healthController.getHealth);

module.exports = router;