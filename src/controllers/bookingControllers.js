const Booking = require('../models/bookingModels');
const { validationResult } = require("express-validator");
const asyncWrapper = require("../middlewares/async.js");
const BadRequestError = require("../error/BadRequestError.js");
const NotFoundError = require('../error/NotFoundError.js');
const Employee=require('../models/employeeModel.js');
const sendEmail = require('../utils/sendEmail.js');

//Create a new booking
const createBooking = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return next(new BadRequestError(errors.array()[0].msg));
  }

  const requiredFields = ['Name', 'Email', 'phoneNumber', 'Address', 'householdSize', 'idCard', 'AdditionalInformation'];
  for (const field of requiredFields) {
      if (!req.body[field]) {
          return res.status(400).json({ error: `Please provide ${field}` });
      }
  }

  const {employeeId }= req.params; 

  
  const employee = await Employee.findOne(employeeId);
  if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
  }

  const newBooking = new Booking({
      ...req.body,
  });

  await newBooking.save();

  const emailText = `
      You have been booked successfully with an employee with the following details:
      Name: ${newBooking.Name}
      Email: ${newBooking.Email}
      Phone Number: ${newBooking.phoneNumber}
      Address: ${newBooking.Address}
      Household Size: ${newBooking.householdSize}
      ID Card: ${newBooking.idCard}
      Additional Information: ${newBooking.AdditionalInformation}
  `;

  try {
      await sendEmail(employee.email, 'Booking Confirmation', emailText);
      console.log('Email sent successfully');
  } catch (error) {
      console.error('Error sending email:', error);
  }

  res.status(201).json({ message: 'Booking request sent successfully' });
});

// GET ALL BOOKINGS
const getAllBookingsController = async (req, res) => {
  try {
    const book = await Booking.find({});
    if (!book) {
      return res.status(404).send({
        success: false,
        message: "No Bookings Available",
      });
    }
    res.status(200).send({
      success: true,
      totalCount: book.length,
      book,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get ALL BOOKINGS API",
      error,
    });
  }
};
 // GET BOOKING BY ID
 const getBookingByIdController = async (req, res) => {
  try {
      const { id } = req.params;

      // Check if the booking exists
      const booker = await Booking.findById(id);
      if (!booker) {
          return res.status(404).send({
              success: false,
              message: "Booking not found"
          });
      }

      res.status(200).send({
          success: true,
          data: booker
      });
  } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message: "Error in the Get Booking by ID API",
          error
      });
  }
};
 //DELETE BOOKING
 const deleteBookingController = async (req, res) => {
  try {
    const BookingId = req.params.id;
    if (!BookingId) {
      return res.status(404).send({
        success: false,
        message: "Booking Not Found OR Provide Booking ID",
      });
    }
    await Booking.findByIdAndDelete(BookingId);
    res.status(200).send({
      success: true,
      message: "Booking Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror in delete Booking API",
      error,
    });
  }
};


module.exports = { createBooking ,
  getAllBookingsController,
  getBookingByIdController,
  deleteBookingController
};