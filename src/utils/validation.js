const { body } = require("express-validator");

const addemployeeValidation = [
    body("name", "Task name is required").not().isEmpty(),
    body("phone", "Phone number must be 10 digits").isLength({ min: 10, max: 10 }).isNumeric().matches(/^(078|073|079|072)\d{7}$/),
    body("idCard", "ID card number must be 16 characters").isLength({ min: 16, max: 16 }).isAlphanumeric()
];

const forgotPasswordValidation = [
    body("email", "Email must be provided").not().isEmpty(),
];

const resetPasswordValidation = [
    body("password", "Password is required").not().isEmpty(),
    body("password", "Password should contain at least 8 characters, uppercase and lower case letters, numbers, and symbols").isStrongPassword()
];

const otpValidation = [
    body("otp", "Otp must be provided").not().isEmpty(),
];

const testValidations = [
    body("name", "Task name is required").not().isEmpty(),
    body("email", "Email is required").not().isEmpty(),
    body("email", "Invalid email").isEmail(),
];

const registerValidations = [
    body("userName", "Last name is required").not().isEmpty(),
    body("email", "Email is required").not().isEmpty(),
    body("email", "Invalid email").isEmail(),
    body("password", "Password is required").not().isEmpty(),
    body("password", "Password should contain at least 8 characters, uppercase and lower case letters, numbers, and symbols").isStrongPassword()
];

const loginValidations = [
    body("email", "Email is required").not().isEmpty(),
    body("email", "Invalid email").isEmail(),
    body("password", "Password is required").not().isEmpty(),
    body("password", "Invalid password").isStrongPassword()
];

module.exports = {
    addemployeeValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    otpValidation,
    testValidations,
    registerValidations,
    loginValidations
};