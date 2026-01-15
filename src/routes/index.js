const express = require('express');
const guestRoutes = require('./guest.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.use('/api/guests', guestRoutes);
router.use('/admin', adminRoutes);

module.exports = router;