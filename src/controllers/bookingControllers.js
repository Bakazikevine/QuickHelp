const Booking = require('../models/bookingModels');
//import userprofilemodel
const sendEmail = require('../utils/sendEmail');

// Controller to create a new booking
const createBooking = async (req, res) => {
  try {
    // Check if all required fields are provided in the request body
    const requiredFields = ['Names', 'Email', 'phoneNumber', 'jobTitle', 'jobDescription', 'jobRoles', 'location', 'duration', 'minSalary', 'maxSalary'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Please provide ${field}` });
      }
    }

    const newBooking = new Booking(req.body);
    await newBooking.save();

    // Fetch the userprofile associated with the booking
    const user = await Userprofile.findById(newBooking.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Construct the link for the user to log back in
    const loginLink = 'https://yourwebsite.com/login'; // Update with your actual login URL

    // Send email to the email of the person booked (from userprofile)
    const emailContent = `
      <p>Hello ${user.email},</p>
      <p>You have received a new booking request with the following details:</p>
      <ul>
        <li>Email: ${newBooking.Email}</li>
        <li>Phone Number: ${newBooking.phoneNumber}</li>
        <li>Job Title: ${newBooking.jobTitle}</li>
        <li>Job Description: ${newBooking.jobDescription.join(', ')}</li>
        <li>Job Roles: ${newBooking.jobRoles.join(', ')}</li>
        <li>Location: ${newBooking.location}</li>
        <li>Duration: ${newBooking.duration}</li>
        <li>Minimum Salary: ${newBooking.minSalary}</li>
        <li>Maximum Salary: ${newBooking.maxSalary}</li>
      </ul>
      <p>Please <a href="${loginLink}">login to your account</a> to approve or deny this booking request.</p>
    `;
    await sendEmail(user.email, 'New Booking Request', emailContent);

    res.status(201).json({ message: 'Booking request sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createBooking };