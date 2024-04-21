const mongoose = require("mongoose");

// Define schema
const employeeSchema = new mongoose.Schema({
  f_Id: {
    type: String,
    required: true,
    unique: true,
  },
  f_Image: {
    type: String,
    required: true,
  },
  f_Name: {
    type: String,
    required: true,
  },
  f_Email: {
    type: String,
    required: true,
    unique: true,
  },
  f_Mobile: {
    type: String,
    required: true,
  },
  f_Designation: {
    type: String,
    required: true,
  },
  f_Gender: {
    type: String,
    required: true,
  },
  f_Course: {
    type: [String],
    required: true,
  },
  f_Createdate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Create model
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
