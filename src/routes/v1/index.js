const express = require('express');
const router = express.Router();
const bookingSchema = require('./../../utils/booking-validate');
const validate = require('./../../middlewares/validate-request');
//add routing logic

const {BookingController} = require('./../../controllers/index');


router.post('/bookings',validate(bookingSchema),BookingController.create);
router.get('/bookings/:id',BookingController.get);
router.patch('/bookings/:id',BookingController.update);


module.exports  = router