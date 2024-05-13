const {upload,
    uploadFile,
    createEmployeeProfile}=require('../controllers/employeeController')
const express=require('express');
const router=express.Router();
//routes
//CREATE PROFILE
router.post('/createProfile',createEmployeeProfile)
module.exports=router;