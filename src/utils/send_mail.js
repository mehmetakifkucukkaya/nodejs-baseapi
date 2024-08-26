const nodemailer = require('nodemailer');

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
    console.log('Mail Gönderilemedi!', err);
    return false;
  }
};

module.exports = sendMail;
