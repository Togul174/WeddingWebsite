const express = require('express');
const router = express.Router();

const guestRoutes = require('./guest.routes');
const adminRoutes = require('./admin.routes');

router.use('/guests', guestRoutes);
router.use('/admin', adminRoutes);

module.exports = router;