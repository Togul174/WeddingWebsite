const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guest.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.post('/create', guestController.createGuest);
router.get('/', requireAuth, guestController.getAllGuests);
router.delete('/:id', requireAuth, guestController.deleteGuest);

module.exports = router;