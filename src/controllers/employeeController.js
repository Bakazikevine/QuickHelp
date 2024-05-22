const Employee = require("../models/employeeModel.js");
const asyncWrapper = require("../middlewares/async.js");
const { validationResult } = require("express-validator");
const { addemployeeValidation } = require("../utils/validation.js");
const BadRequestError = require("../error/BadRequestError.js");
const { NotFoundError } = require("../error/NotFoundError.js");
// const cloudinary = require("../utils/cloudinary.js");

const employeeController = {
  addEmployee: asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new BadRequestError(errors.array()[0].msg));
    }
    const {
      firstName,
      lastName,
      email,
      phone,
      idCard,
      job,
      experience,
      min_salary,
      status,
    } = req.body;

    const profilePicture = req.file.path ;

    const addedEmployee = await Employee.create({
      firstName,
      lastName,
      email,
      phone,
      idCard,
      job,
      experience,
      min_salary,
      status,
      profilePicture,
    });
    res.status(201).json({ success: true, data: addedEmployee });
  }),

  getEmployee: asyncWrapper(async (req, res, next) => {
    const listEmployee = await Employee.find();
    res.status(201).json({
      message: "List of All Employees",
      data: listEmployee,
    });
  }),

  getEmployeeById: asyncWrapper(async (req, res, next) => {
    const employeeById = await Employee.findById(req.params.id);
    if (!employeeById) {
      return next(`Employee not found`);
      next(error);
    }
    res.status(201).json({
      message: "Get Employee",
      data: employeeById,
    });
  }),

  updateEmployee: asyncWrapper(async (req, res, next) => {
    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      idCard: req.body.idCard,
      job: req.body.job,
      experience: req.body.experience,
      min_salary: req.body.min_salary,
      status: req.body.status,
    };
  
    // Include the profile picture if it exists
    if (req.file) {
      updateData.profilePicture = req.file.path;
    }
  
    const updateEmployee = await Employee.findOneAndUpdate(
      { _id: req.params.id },
      updateData,
      { new: true }
    );
  
    if (!updateEmployee) {
      return next(new NotFoundError("Employee not found"));
    }
  
    res.status(200).json({
      message: "Employee updated",
      data: updateEmployee,
    });
  }),
  

  deleteEmployee: asyncWrapper(async (req, res, next) => {
    const deleteemployee = await Employee.deleteOne({
      _id: req.params.id,
    });

    res.status(201).json({
      message: "Employee deleted",
      data: deleteemployee,
    });
  }),

  getEmployeeByJobs: asyncWrapper(async (req, res, next) => {
    const { job } = req.params;
    const jobName = await Employee.findOne({ job: job });
    if (!jobName) {
      return next(`Employee not found`);
    }
    res.status(201).json({
      message: "Get Employees By their Jobs",
      data: jobName,
    });
  }),
  getEmployeeByStatus: asyncWrapper(async (req, res, next) => {
    const { status } = req.params;
    const Employeestatus = await Employee.findOne({ status: status });
    if (!Employeestatus) {
      return next(`Employee not found`);
    }
    res.status(201).json({
      message: "Get Employees By their status",
      data: Employeestatus,
    });
  }),
};
module.exports = employeeController;
