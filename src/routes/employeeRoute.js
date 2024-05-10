const express = require( 'express');
const employeeController =require('../controllers/employeeController');
const employeeroute = express.Router();
const upload = require('../middlewares/upload.js')

employeeroute.post('/add',upload.single('profilePicture'),employeeController.addEmployee);
employeeroute.get('/get',employeeController.getEmployee);
employeeroute.get('/getById/:id',employeeController.getEmployeeById);
employeeroute.put('/update/:id',employeeController.updateEmployee);
employeeroute.delete('/delete/:id',employeeController.deleteEmployee);
module.exports=employeeroute;