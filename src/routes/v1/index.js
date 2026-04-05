const express = require('express');
const router = express.Router();
//add routing logic

const {BookingController} = require('./../../controllers/index');

router.post('/bookings',BookingController.create);
router.get('/bookings/:id',BookingController.get);
router.patch('/bookings/:id',BookingController.update);

module.exports  = router