const Employee = require ('../models/employeeModel.js')
const asyncWrapper = require ('../middlewares/async.js');
import { validationResult } from 'express-validator';

export const employeeController = {
  addEmployee: asyncWrapper(async (req, res , next) => {
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
          next(new BadRequestError(errors.array()[0].msg));
      }
      const newEmployee = await Employee.create(req.body);
      res.status(201).json({ success: true, data: newEmployee });
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
         name: req.body.name,
          contact: req.body.contact,
          medicalhistory: req.body.medicalHistory
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
module.exports = employeeController;
