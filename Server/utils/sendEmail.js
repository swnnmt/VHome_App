const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // nếu dùng Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendVerificationEmail = async (to, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Mã xác thực tài khoản VHome',
    text: `Mã xác thực của bạn là: ${code}. Mã này có hiệu lực trong 10 phút.`,
  };

  return transporter.sendMail(mailOptions);
};
