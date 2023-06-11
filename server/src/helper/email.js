const nodemailer = require("nodemailer");
const { smtpUsername, smptPassword } = require("../secret");

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: smtpUsername, // generated ethereal user
    pass: smptPassword, // generated ethereal password
  },
});

const emailWithNodeMailer = async (emailData) => {
  try {
    const mailOptions = {
      from: smtpUsername, // sender address
      to: emailData.email, // list of receivers
      subject: emailData.subject, // Subject line
      html: emailData.html, // html body
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent:%s", info.response);
  } catch (error) {
    console.log(
      "Error something went wrong while sending the verification email:",
      error
    );
    throw error;
  }
};
module.exports = { emailWithNodeMailer };
