const { body, validationResult } = require("express-validator");

const addemployeeValidation = [
    body("firstName", "First name is required").notEmpty(),
    body("lastName", "Last name is required").notEmpty(),
    body("email", "Email is required").notEmpty(),
    body("email", "Invalid email").isEmail(),
    body("phone", "Phone number must be Airtel or MTN and must contain 10 numbers ").isLength({ min: 10, max: 10 }).isNumeric().matches(/^(078|073|079|072)\d{7}$/),
    body("idCard", "ID card number must be 16 characters").isLength({ min: 16, max: 16 }).isAlphanumeric()
];
const addBookingValidation = [
    body("Name", "First name is required").notEmpty(),
    body("Email", "Email is required").notEmpty(),
    body("Email", "Invalid email").isEmail(),
    body("phoneNumber", "Phone number must be Airtel or MTN and must contain 10 numbers ").isLength({ min: 10, max: 10 }).isNumeric().matches(/^(078|073|079|072)\d{7}$/),
    body("idCard", "ID card number must be 16 characters").isLength({ min: 16, max: 16 }).isAlphanumeric()
];
const forgotPasswordValidation = [
    body("email", "Email must be provided").notEmpty(),
];

const resetPasswordValidation = [
    body("password", "Password is required").notEmpty(),
    body("password", "Password should contain atleast 8 characters, uppercase and lower case letters, numbers, and symbols").isStrongPassword()
];

const otpValidation = [
    body("otp", "Otp must be provided").notEmpty(),
];

const testValidations = [
    body("name", "Task name is required").notEmpty(),
    body("email", "Email is required").notEmpty(),
    body("email", "Invalid email").isEmail(),
];

const registerValidations = [
    body("userName", "Last name is required").not().isEmpty(),
    body("email", "Email is required").notEmpty(),
    body("email", "Invalid email").isEmail(),
    body("password", "Password is required").notEmpty(),
    body("password", "Password should contain atleast 8 characters, uppercase and lower case letters, numbers, and symbols").isStrongPassword()
];

const loginValidations = [
    body("email", "Email is required").notEmpty(),
    body("email", "Invalid email").isEmail(),
    body("password", "Password is required").notEmpty(),
    body("password", "Invalid password").isStrongPassword()
];

module.exports = {
    addemployeeValidation,
    addBookingValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    otpValidation,
    testValidations,
    registerValidations,
    loginValidations
};