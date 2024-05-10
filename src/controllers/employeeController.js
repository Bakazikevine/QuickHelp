const Employee = require ('../models/employeeModel.js')
const asyncWrapper = require ('../middlewares/async.js');
const { validationResult } = require('express-validator');

const {BadRequestError}= require('../error/BadRequestError.js')
const {NotFoundError}= require('../error/NotFoundError.js')

const employeeController = {
  addEmployee: asyncWrapper(async (req, res , next) => {
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
          next(new BadRequestError(errors.array()[0].msg));
      }     let profilePicture = '';
      if (req.file) {
          profilePicture = req.file.path;
      }
  
      const newEmployeeData = {
          ...req.body,
          profilePicture, // Set profile picture if available
      };
      res.status(201).json({ success: true, data: newEmployeeData });
  }),

  getEmployee:asyncWrapper(async (req, res , next) => {
      const listEmployee = await Employee.find();
      res.status(201).json({
        message: "List of All Employees",
        data: listEmployee,
      });
  }),

  getEmployeeById: asyncWrapper( async (req, res, next) => {
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

  updateEmployee: asyncWrapper(async (req, res , next) => {
      const updateemployee = await Employee.findOneAndUpdate(
        { _id: req.params.id },
        {
         firstName: req.body.firstName,
         laststName: req.body.laststName,
         email: req.body.email,
         phone: req.body.phone,
         idCard: req.body.idCard,
         job: req.body.job,
         cv: req.body.cv,
         experience: req.body.experience,
         min_salary: req.body.min_salary,
         profilePicture: req.file.path
        },
        { new: true }
      );
      if (!updateEmployee) {
        return next(new NotFoundError(`Employee not found`));
    } 
      res.status(201).json({
        message: "Employee updated",
        data: updateemployee,
      });
  }),

  deleteEmployee: asyncWrapper( async (req, res , next ) => {
      const deleteemployee = await Employee.deleteOne({
        _id: req.params.id,
      });
  
      res.status(201).json({
        message: "Employee deleted",
        data: deleteemployee,
      });
  }),
 };
module.exports=employeeController;
