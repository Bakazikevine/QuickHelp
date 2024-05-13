
const mongoose = require('mongoose');


const EmployeeProfileSchema = new mongoose.Schema({
    
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    jobTitles: {
        type: [String],
        required: true
    },
    responsibilities: {
        type: [String],
        required:true
    },
    achievements: {
        type: [String]
    },
    relevantSkills: {
        type: [String],
        required: true
    },
    experience: {
        type: String,
        required: false
    },
    certifications: {
        type: [String]
    },
    academicBackground: {
        type: String
    },
    professionalBackground: {
        type: String
    },
    availability: {
        startTime: { type: String }, 
        endTime: { type: String }
    },
    salaryRange: {
        min: { type: Number },
        max: { type: Number }
    },
   
    cv: {
        originalName: String,
        fileName: String, 
        filePath: String 
    },
    
    profilePicture: {
        originalName: String, 
        fileName: String, 
        filePath: String 
    },
    // National ID card upload
    nationalIdCard: {
        originalName: String, // Original name of the uploaded file
        fileName: String, // Name of the file stored on the server
        filePath: String // Path where the file is stored on the server
    },
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create the model
const EmployeeProfile = mongoose.model('EmployeeProfile', EmployeeProfileSchema);

// Export the model
module.exports = EmployeeProfile;