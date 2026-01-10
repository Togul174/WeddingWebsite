const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guest.controller');

console.log('Guest controller методы:', Object.keys(guestController));

router.post('/create', guestController.createGuest);
router.get('/', guestController.getAllGuests);
router.get('/:id', guestController.getGuestById);
router.put('/:id', guestController.updateGuest);
router.delete('/:id', guestController.deleteGuest);

module.exports = router;



