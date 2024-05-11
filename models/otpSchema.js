const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
  Email: {
    type: String,
    unique: true,
  },
  otp: {
    type: Number,
  },
  createdAt: {
    type: Date,
  },
  isExpired: {
    type: Boolean,
    default: false,
  },
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;
