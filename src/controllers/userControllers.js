// Import necessary modules and constants
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const configs = require('../config/index');
const otpGenerator = require('../utils/otp.js');
const sendEmail = require('../utils/sendEmail.js');
const jwt_secret = configs.JWT_SECRET;
const { v4: uuidv4 } = require('uuid');

// Register controller
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

        // Generating OTP and verification token
        const otp = otpGenerator();
        const otpExpirationDate = new Date().getTime() + (60 * 1000 * 5);
        await sendEmail(email, "Verify your account", `Your OTP is ${otp} `);

        // Create user with OTP, verification token, and expiration date
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

// Verify account controller
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
                message: "OTP has expired. Please register again."
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

// Login controller
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(500).send({
                success: false,
                message: "Please provide Email and Password"
            });
        }

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User Not Found"
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
            return res.status(500).send({
                success: false,
                message: "Invalid credentials"
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
            message: 'Error in Login API',
            error
        });
    }
};
const resetPasswordRequestController = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User Not Found"
            });
        }
// Generate a unique reset token
const resetToken = uuidv4();

// Set expiration time for token (e.g., 1 hour)
const expirationTime = new Date();
expirationTime.setHours(expirationTime.getHours() + 1);

// Save token and expiration time to user document
user.resetPasswordToken = resetToken;
user.resetPasswordExpires = expirationTime;
await user.save();

// Send email with reset password link
const resetPasswordLink = `${resetToken}`;
await sendEmail(email, "Password Reset Request", `Click the following link to reset your password:http://localhost:6000/api/v1/auth/reset${resetPasswordLink}`);

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
// Reset password controller
const resetPasswordController = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Find user by reset token
        const user = await userModel.findOne({ resetPasswordToken: token });

        // Check if token is expired
        if (!user || user.resetPasswordExpires < new Date()) {
            return res.status(400).send({
                success: false,
                message: "Password reset token is invalid or expired"
            });
        }

        // Update user's password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;

        // Clear reset token and expiration date
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).send({
            success: true,
            message: "Password reset successful",
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
// Logout controller
const logoutController = async (req, res) => {
    try {
        // Clear the authentication token from client-side storage (e.g., cookies)
        res.clearCookie('jwtToken');

        res.status(200).send({
            success: true,
            message: "Logout successful",
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

// Export controllers
module.exports = { registerController, loginController, verifyAccountController,resetPasswordRequestController,resetPasswordController,logoutController };