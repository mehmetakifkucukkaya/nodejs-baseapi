const nodemailer = require('nodemailer');
const APIError = require('../utils/errors');
const sendMail = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Mail başarıyla gönderildi:', info);
    return true;
  } catch (err) {
    throw new APIError('Mail gönderilirken bir hata oluştu', 500);
  }
};

module.exports = sendMail;
