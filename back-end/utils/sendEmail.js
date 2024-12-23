const nodemailer = require('nodemailer');

// Create a transporter object using the SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // Use 465 for SSL
  secure: false, // Set to true if using SSL (port 465)
  auth: {
    user: 'codingworldcrazycube@gmail.com',  // Replace with your email
    pass: 'xqkkvxqgesybalvp'    // Replace with your email password or app password
  }
});

// Function to send an email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'codingworldcrazycube@gmail.com',
    to,
    subject,
    text
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
