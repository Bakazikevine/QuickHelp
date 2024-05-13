const nodemailer=require('nodemailer')
const sendEmail = (recipient, subject, body) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || "gmail",
        auth: {
            user: process.env.EMAIL_USER || "queencarineh@gmail.com", 
            pass: process.env.EMAIL_PASSWORD || "hzbp vdms pdur batl"
        }
    });

    const mailOptions = {
        from: '"Quick Help" <queencarineh@gmail.com>',
        to: recipient,
        subject: subject,
        text: body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error.message);
            return {
                success: false,
                message: 'Error sending email'
            };
        } else {
            console.log('Email sent:', info.response);
            return {
                success: true,
                message: 'Email sent successfully'
            };
        }
    });
};

module.exports = sendEmail;