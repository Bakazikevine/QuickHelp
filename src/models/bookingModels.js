const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userprofile', 
    required: true
  },
  Names: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true,
    unique:true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  jobDescription: {
    type: [String],
    required: true
  },
  jobRoles: {
    type: [String],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  minSalary: {
    type: String,
    required: true
  },
  maxSalary: {
    type: String,
    required: true
  }
}, { timestamps: true }); 

module.exports = mongoose.model('Booking', BookingSchema);