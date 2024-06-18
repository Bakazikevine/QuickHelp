const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const configs = require('../config/index');
const otpGenerator = require('../utils/otp.js');
const sendEmail = require('../utils/sendEmail.js');
const jwt_secret = configs.JWT_SECRET;
const { v4: uuidv4 } = require('uuid');

const registerController = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        // Password validation
        const passwordRegex = /^(?=.*\d)(?=.*[@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).send({
                success: false,
                message: "Password must be at least 8 characters long, contain one number, one symbol, and one uppercase letter."
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send({
                success: false,
                message: "Email must contain '@' symbol and follow the email format."
            });
        }

        // Validation
        if (!userName || !email || !password) {
            return res.status(500).send({
                success: false,
                message: "Please fill in all the fields"
            });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(500).send({
                success: false,
                message: "Email already in use, please login"
            });
        }

        // Hashing password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generating OTP
        const otp = otpGenerator();
        const otpExpirationDate = new Date().getTime() + (60 * 1000 * 5);

        // Send OTP to user's email
        await sendEmail(email, "Verify your account", `Your OTP is ${otp}`);

        // Create user with OTP, and expiration date
        const user = await userModel.create({
            userName,
            email,
            password: hashedPassword,
            otp,
            expiresIn: otpExpirationDate
        });

        res.status(201).send({
            success: true,
            message: "User registered successfully. Verification email sent.",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in API",
            error
        });
    }
};

const verifyAccountController = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find user by email
        const user = await userModel.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User Not Found"
            });
        }

        // Check if OTP matches
        if (user.otp !== otp) {
            return res.status(400).send({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Check if OTP has expired
        if (user.expiresIn < new Date()) {
            return res.status(400).send({
                success: false,
                message: "OTP has expiredd. Please register again."
            });
        }

        // Mark user as verified
        user.isVerified = true;
        await user.save();

        res.status(200).send({
            success: true,
            message: "Account verified successfully. You can now login.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in account verification",
            error
        });
    }
};

const loginController = async (req, res) => {
  try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
          return res.status(400).send({
              success: false,
              message: "Please provide both Email and Password"
          });
      }

      // Check if user exists
      const user = await userModel.findOne({ email });
      if (!user) {
          return res.status(404).send({
              success: false,
              message: "User not found"
          });
      }

      // Check if account is verified
      if (!user.isVerified) {
          return res.status(400).send({
              success: false,
              message: "Account not verified. Please verify your account first."
          });
      }

      // Check user password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).send({
              success: false,
              message: "Invalid Password"
          });
      }

      // Generate JWT token
      const token = JWT.sign({ id: user._id }, jwt_secret, {
          expiresIn: "7d",
      });

      // Remove sensitive information
      user.password = undefined;

      res.status(200).send({
          success: true,
          message: "Login successful",
          token,
          user,
      });
  } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message: "Error in Login API",
          error
      });
  }
};
// Request Password Reset Controller
const requestResetPasswordController = async (req, res) => {
  try {
      const { email } = req.body;

      // Check if user exists
      const user = await userModel.findOne({ email });
      if (!user) {
          return res.status(404).send({
              success: false,
              message: "User not found"
          });
      }

      // Generate a unique reset token
      const resetToken = uuidv4();

      // Set expiration time for the reset token (e.g., 1 hour)
      const resetTokenExpires = new Date();
      resetTokenExpires.setHours(resetTokenExpires.getHours() + 1);

      // Save reset token and expiration time to user document
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpires;
      await user.save();

      // Send email with password reset link
      const resetPasswordLink = `http://localhost:3000/reset-password/${resetToken}`;
      await sendEmail(email, "Password Reset Request", `Click the following link to reset your password: ${resetPasswordLink}`);

      res.status(200).send({
          success: true,
          message: "Password reset link sent to your email",
      });
  } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message: "Error in password reset request",
          error
      });
  }
};
// Reset Password Controller
const resetPasswordController = async (req, res) => {
  try {
      const { token, newPassword } = req.body;

      // Find user by reset token
      const user = await userModel.findOne({ resetPasswordToken: token });

      // Check if user exists and token is not expired
      if (!user || user.resetPasswordExpires < new Date()) {
          return res.status(400).send({
              success: false,
              message: "Invalid or expired token"
          });
      }

      // Hash new password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update user's password and clear reset token fields
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.status(200).send({
          success: true,
          message: "Password reset successfully",
      });
  } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message: "Error in password reset",
          error
      }); 
  }
};
const logoutController = (req, res) => {
  try {
      res.clearCookie('token'); 

      res.status(200).send({
          success: true,
          message: "Logout successful"
      });
  } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message: "Error in logout",
          error
      });
  }
};
module.exports={
  registerController,
  verifyAccountController,
  loginController,
  requestResetPasswordController,
  resetPasswordController,
  logoutController
}