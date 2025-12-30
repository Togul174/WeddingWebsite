const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guest.controller');

console.log('Guest controller методы:', Object.keys(guestController));

router.post('/create-guest', guestController.createGuest);
router.get('/guests', guestController.getAllGuests);
router.get('/guests/:id', guestController.getGuestById);

module.exports = router;