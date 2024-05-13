import { body } from "express-validator";

export const addemployeeValidation = [
    body("name", "Task name is required").not().isEmpty(),
    body("phone", "Phone number must be 10 digits").isLength({ min: 10, max: 10 }).isNumeric().matches(/^(078|073|079|072)\d{7}$/),
    body("idCard", "ID card number must be 16 characters").isLength({ min: 16, max: 16 }).isAlphanumeric()
];

export const forgotPasswordValidation = [
    body("email", "Email must be provided").not().isEmpty(),

];

export const resetPasswordValidation = [
    body("password", "Password is required").not().isEmpty(),
    body("password", "Password should contain atleast 8 characters, uppercase and lower case letters, numbers, and symbols").isStrongPassword()
];

export const otpValidation = [
    body("otp", "Otp must be provided").not().isEmpty(),
];

export const testValidations = [
    body("name", "Task name is required").not().isEmpty(),
    body("email", "Email is required").not().isEmpty(),
    body("email", "Invalid email").isEmail(),
];

export const registerValidations = [
    body("userName", "Last name is required").not().isEmpty(),
    body("email", "Email is required").not().isEmpty(),
    body("email", "Invalid email").isEmail(),
    body("password", "Password is required").not().isEmpty(),
    body("password", "Password should contain atleast 8 characters, uppercase and lower case letters, numbers, and symbols").isStrongPassword()
];

export const loginValidations = [
    body("email", "Email is required").not().isEmpty(),
    body("email", "Invalid email").isEmail(),
    body("password", "Password is required").not().isEmpty(),
    body("password", "Invalid password").isStrongPassword()
];