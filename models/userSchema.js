const mongoose = require("mongoose");
const { Schema } = mongoose;

//Define the User Schema
const UserSchema = new Schema({
  Name: {
    type: String,
  },
  Email: {
    type: String,
    required: true,
  },
  userPassword: {
    type: String,
    required: false,
  },
  Status: {
    type: String,
    default: "Active",
  },
  createdAt: {
    type: Date,
    default: Date.now // Set default value to current date
  },
  Address: [
    {
      name: {
        type: String,
      },
      addressLane: {
        type: String,
      },
      city: {
        type: String,
      },
      district :{
        type : String,
      },
      locality: {
        type: String,
      },
      pincode: {
        type: Number,
      },
      state: {
        type: String,
      },
      mobile: {
        type: Number,
      },
    },
  ],
});

// Creating User model based on UserSchema
const User = mongoose.model("User", UserSchema);

//exporting the user model
module.exports = User;
