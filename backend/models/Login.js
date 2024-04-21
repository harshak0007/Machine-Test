const mongoose = require("mongoose");

// Define schema
const loginSchema = new mongoose.Schema({
  f_sno: {
    type: Number,
    required: true,
    unique: true,
  },
  f_userName: {
    type: String,
    required: true,
    unique: true,
  },
  f_Email: {
    type: String,
    required: true,
    unique: true,
  },
  f_Pwd: {
    type: String,
    required: true,
  },
});

// Create model
const Login = mongoose.model("Login", loginSchema);

module.exports = Login;
