const express = require('express');
const router = express.Router();
//add routing logic

const {BookingController} = require('./../../controllers/index');
const bookingController = new BookingController();

router.post('/bookings',bookingController.create);
router.post('/bookings/publish',bookingController.sendMessageToQueue);
router.get('/bookings/:id',bookingController.get);
router.patch('/bookings/:id',bookingController.update);


module.exports  = router