const { Schema, default: mongoose } = require("mongoose");
const Employee = require("../models/employeeModel.js");
const asyncWrapper = require("../middlewares/async.js");
const { validationResult } = require("express-validator");
const BadRequestError = require("../error/BadRequestError.js");
const NotFoundError = require('../error/NotFoundError.js');
const jobsModel = require("../models/jobsModel.js");
const cloudinary = require("../utils/cloudinary.js");
// CREATE EMPLOYEE
const employeeController = {
  addEmployee: asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new BadRequestError(errors.array()[0].msg));
    }
    let profilePicture = {};
    try {
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        profilePicture = {
          public_id: result.public_id,
          asset_id: result.asset_id,
          url: result.secure_url
        };
      }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return next(new Error("Failed to upload profile picture to Cloudinary"));
    }
    const {
      firstName,
      lastName,
      email,
      phone,
      idCard,
      JobName,
      experience,
      min_salary,
      status,
      dateOfBirth
    } = req.body;
    if (!JobName) {
      return res.status(400).send({
        success: false,
        message: "Job name is required"
      });
    }
    const jobData = await jobsModel.findOne({ JobName: JobName });
    if (!jobData) {
      return res.status(400).send({
        success: false,
        message: "Job does not exist"
      });
    }
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    // Check if age is less than 18
    if (age < 18) {
      return res.status(400).send({
        success: false,
        message: "Employees should be 18 years of age and above"
      });
    }
    const addedEmployee = await Employee.create({
      firstName,
      lastName,
      email,
      phone,
      idCard,
      JobName,
      experience,
      min_salary,
      status,
      profilePicture,
      dateOfBirth
    });
    res.status(201).json({ success: true, data: addedEmployee });
  }),
  // GET ALL EMPLOYEES
  getEmployee: asyncWrapper(async (req, res, next) => {
    const listEmployee = await Employee.find({});
    if (!listEmployee) {
      return res.status(404).send({
        success: false,
        message: "No Employee Available",
      });
    }
    res.status(200).send({
      message:"List of all Employees",
      totalCount:listEmployee.length,
      data:listEmployee
    });
  }),
  // GET BY ID
  getEmployeeById: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new BadRequestError("Invalid employee ID"));
    }
    const employeeById = await Employee.findById(id);
    if (!employeeById) {
      return next(new NotFoundError("Employee not found"));
    }
    res.status(200).json({
      message: "Get Employee",
      data: employeeById,
    });
  }),
  // UPDATE EMPLOYEE
  updateEmployee: asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new BadRequestError(errors.array()[0].msg));
    }
    let profilePicture = {};
    try {
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        profilePicture = {
          public_id: result.public_id,
          asset_id: result.asset_id,
          url: result.secure_url
        };
      }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return next(new Error("Failed to upload profile picture to Cloudinary"));
    }
    const {
      firstName,
      lastName,
      email,
      phone,
      idCard,
      JobName,
      experience,
      min_salary,
      status,
      dateOfBirth
    } = req.body;
    const updateData = {
      firstName,
      lastName,
      email,
      phone,
      idCard,
      experience,
      min_salary,
      status,
    };
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updateData.profilePicture = {
        public_id: result.public_id,
        asset_id: result.asset_id,
        url: result.secure_url
      };
    }
    if (JobName) {
      const jobData = await jobsModel.findOne({ JobName: JobName });
      if (!jobData) {
        return res.status(400).send({
          success: false,
          message: "Job does not exist"
        });
      }
      updateData.JobName = jobData._id;
    }
    if (dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        return res.status(400).send({
          success: false,
          message: "Employees should be 18 years of age and above"
        });
      }
      updateData.dateOfBirth = dateOfBirth;
    }
    const updatedEmployee = await Employee.findOneAndUpdate(
      { _id: req.params.id },
      updateData,
      { new: true }
    );
    if (!updatedEmployee) {
      return next(new NotFoundError("Employee not found"));
    }
    res.status(200).json({
      message: "Employee updated",
      data: updatedEmployee,
    });
  }),
  // DELETE EMPLOYEE
  deleteEmployee: asyncWrapper(async (req, res, next) => {
    const deleteemployee = await Employee.deleteOne({
      _id: req.params.id,
    });
    res.status(200).json({
      message: "Employee deleted",
      data: deleteemployee,
    });
  }),
  // GET EMPLOYEE BY JOBS
  getEmployeeByJobs: asyncWrapper(async (req, res, next) => {
    const { JobName } = req.params;
    const jobData = await jobsModel.findOne({ JobName: JobName });
    if (!jobData) {
      return res.status(400).send({
        success: false,
        message: "Job does not exist"
      });
    }
    const employees = await Employee.find({ JobName: JobName });
    if (employees.length === 0) {
      return next(new NotFoundError("No employees found for this job"));
    }
    res.status(200).json({
      message: "Got Employees By their Job Name",
      totalCount:employees.length,
      data: employees,
    });
  }),
  // GET EMPLOYEES BY STATUS
  getEmployeeByStatus: asyncWrapper(async (req, res, next) => {
    const { status } = req.params;
    const employeesWithStatus = await Employee.find({ status });
    if (employeesWithStatus.length === 0) {
      return next(new NotFoundError("No employees with this status"));
    }
    res.status(200).json({
      message: "Get Employees By their status",
      totalCount:employeesWithStatus.length,
      data: employeesWithStatus,
    });
  }),
};
module.exports = employeeController;