const { registerController, verifyAccountController, loginController, requestResetPasswordController, resetPasswordController, logoutController } = require('../controllers/userControllers');
const express = require('express');
const router = express.Router();

// REGISTER 
router.post('/register', registerController);

// VERIFY ACCOUNT 
router.post('/verify', verifyAccountController);

// LOGIN 
router.post('/login', loginController);
// REQUEST RESET PASSWORD 
router.post('/request', requestResetPasswordController);
// REQUEST RESET PASSWORD
router.post('/reset', resetPasswordController);
// LOGOUT
router.post('/logout', logoutController);

module.exports = router;