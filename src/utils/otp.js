const otpGenerator = () => {
    // Generate a 6-digit random number as OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
};

module.exports = otpGenerator;