const express = require('express');
const router = express.Router();
const { createBooking ,getAllBookingsController, getBookingByIdController,deleteBookingController} = require('../controllers/bookingControllers');
const {addBookingValidation} = require("../utils/validation")

// Route to create a new booking
router.post('/bookings',addBookingValidation, createBooking);
router.get('/getAllBookings',getAllBookingsController);
router.get('/getBookingById/:id',getBookingByIdController);
router.delete('/deleteBooking/:id', deleteBookingController);
module.exports=router