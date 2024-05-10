const {registerController, loginController}=require('../controllers/userControllers')
const express=require('express');
const router=express.Router();
//routes
//REGISTER||POST
router.post('/register',registerController)
//LOGIN||POST
router.post('/login',loginController)

module.exports=router;