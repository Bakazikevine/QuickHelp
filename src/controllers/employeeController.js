const multer = require('multer');
const EmployeeProfile = require('../models/employeeModel');
const {
    uploadFile,
    updateFileDetails
} = require('../Middlewares/uploadMiddles');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set the destination folder where files will be uploaded
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Generate a unique filename for the uploaded file
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Multer upload instance
const upload = multer({ storage: storage });

// Middleware to create an employee profile
const createEmployeeProfile = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            jobTitles,
            responsibilities,
            relevantSkills,
            achievements,
            experience,
            certifications,
            academicBackground,
            professionalBackground,
            availability,
            salaryRange,
            portfolio
        } = req.body;

        // Check if all required fields are provided
        if (!firstName || !lastName || !email || !jobTitles || !responsibilities || !relevantSkills) {
            return res.status(400).send('All required fields must be provided.');
        }

        // Create the employee profile
        const employeeProfile = new EmployeeProfile({
            firstName,
            lastName,
            email,
            jobTitles,
            responsibilities,
            relevantSkills,
            achievements,
            experience,
            certifications,
            academicBackground,
            professionalBackground,
            availability,
            salaryRange,
            portfolio
        });

        // Check and handle file uploads
        if (req.file) {
            // Update file details for profile picture
            await updateFileDetails('profilePicture')(req, res, next);
            // Update file details for national ID card
            await updateFileDetails('nationalIdCard')(req, res, next);
            // Update file details for CV
            await updateFileDetails('cv')(req, res, next);
        }

        // Save the employee profile to the database
        await employeeProfile.save();
        
        res.status(201).send('Employee profile created successfully.');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error creating employee profile.');
    }
};

module.exports = {
    upload,
    uploadFile,
    createEmployeeProfile
};