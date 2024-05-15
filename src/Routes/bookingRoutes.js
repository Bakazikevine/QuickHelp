const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/bookingControllers');

// Route to create a new booking
router.post('/bookings', createBooking);
module.exports=router