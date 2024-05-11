const sendMail = require("./SendMail");
const OTP = require("../models/otpSchema");
require("dotenv").config();

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

module.exports.sendOtp = async (email) => {
  const otp = generateOTP();
  const date = Date.now();

  const newotp = await OTP.create({
    Email: email,
    otp: otp,
    createdAt: date,
    isExpired: false,
  });

  const mailOption = {
    from: process.env.AdminMail,
    to: email,
    subject: "OTP Verification",
    text: `Your one time OTP is ${otp}`,
  };

  const mailResponse = await sendMail.sendMail(mailOption);

  return mailResponse;
};
