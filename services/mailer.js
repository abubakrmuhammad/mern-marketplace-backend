const nodemailer = require('nodemailer');
require('dotenv').config();

//nodemailer stuff
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_APP_PASS,
  },
});

const sendConfirmationEmail = (name, email, confirmationCode) => {
  console.log('Check');
  transporter
    .sendMail({
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: 'Please verify your email',
      html: `<h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for signing up. Please confirm your email by clicking on the following link</p>
          <a href=http://localhost:5173/confirm/${confirmationCode}> Click here</a>
          </div>`,
    })
    .catch(err => console.log(err));
};

const sendPassResetEmail = (name, email, confirmationCode) => {
  console.log('Check');
  transporter
    .sendMail({
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: 'MERN Marketplace Password Reset',
      html: `<h1>Dear ${name},</h1>
          
          <p>We have received a request to reset the password for your account. If you did not request a password reset, please ignore this email.<br>To reset your password, please follow the link below:</p>
          <a href=http://localhost:5173/reset-pass?token=${confirmationCode}> Click here</a>
          <br>
          <p>Thank you,</p>
          <p>Team MERN Marketplace</p>
          </div>`,
    })
    .catch(err => console.log(err));
};

module.exports = {
  transporter,
  sendConfirmationEmail,
  sendPassResetEmail,
};
