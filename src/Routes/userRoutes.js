const {registerController, loginController,resetPasswordRequestController, resetPasswordController, verifyAccountController,logoutController}=require('../controllers/userControllers')
const express=require('express');
const router=express.Router();
//routes
//REGISTER
router.post('/register',registerController)
//VERIFY ACCOUNT
router.post('/verify',verifyAccountController)
//LOGIN||POST
router.post('/login',loginController)
//REQUEST RESET PASSWORD
router.post('/request',resetPasswordRequestController)
// RESET PASSWORD
router.post('/reset',resetPasswordController)
// LOGOUT 
router.post('/logout',logoutController)
module.exports=router;