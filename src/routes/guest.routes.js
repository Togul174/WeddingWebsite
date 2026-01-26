const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guest.controller');

console.log('Guest controller методы:', Object.keys(guestController));

router.post('/create', guestController.createGuest);
router.get('/', guestController.getAllGuests);

module.exports = router;
