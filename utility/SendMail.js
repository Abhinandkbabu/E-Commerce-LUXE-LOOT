const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.ADMIN_MAIL,
    pass: process.env.ADMIN_MAIL_PASSWORD,
  },
  secure: true,
});

module.exports.sendMail = (mailOption) =>
  new Promise((resolve, reject) => {
    transporter.sendMail(mailOption, (err, info) => {
      if (err) return reject(err);
      else return resolve(info);
    });
  });
