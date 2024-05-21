const express = require("express");
const employeeController = require("../controllers/employeeController");
const employeeroute = express.Router();
const upload = require("../middlewares/upload.js");
const {addemployeeValidation} = require("../utils/validation.js")
// const cloudinary = require("../utils/cloudinary.js")

employeeroute.post("/add", upload.single('profilePicture'), addemployeeValidation, employeeController.addEmployee);
employeeroute.get("/get", employeeController.getEmployee);
employeeroute.get("/getById/:id", employeeController.getEmployeeById);
employeeroute.get("/getByjobs/:job", employeeController.getEmployeeByJobs);
employeeroute.get("/getBystatus/:status", employeeController.getEmployeeByStatus);
employeeroute.put("/update/:id",upload.single('profilePicture'),employeeController.updateEmployee);

employeeroute.delete("/delete/:id", employeeController.deleteEmployee);
module.exports = employeeroute;