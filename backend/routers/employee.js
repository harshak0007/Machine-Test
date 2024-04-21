const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Login = require("../models/Login");
const Employee = require("../models/Employee");
const bcryptsjs = require("bcryptjs");

const jwt = require("jsonwebtoken");
const verifyToken = require("./verify");
require("dotenv").config();

// Login Routes
// Create login
let nextSno = 1;
let nextSnoEmp = 1;
const isDuplicateEmailSignup = async (email) => {
  const existingEmail = await Login.findOne({ f_Email: email });
  return existingEmail != null;
};
router.post("/signup", async (req, res) => {
  try {
  
    const { f_userName, f_Email, f_Pwd } = req.body;
    const result = await isDuplicateEmailSignup(f_Email);
   
    if (result) {
      return res.status(400).send({ error: "Email already exists." });
    }
   
    const salt = await bcryptsjs.genSalt(10);
    const hashedPassword = await bcryptsjs.hash(f_Pwd, salt);
    const login = new Login({
      f_sno: nextSno++,
      f_userName: f_userName,
      f_Email: f_Email,
      f_Pwd: hashedPassword,
    });

    await login.save();
 
    res.status(200).send({ message: "Successful" });
  } catch (error) {
    res.status(400).send(error);
  }
});
router.post("/login", async (req, res) => {
  try {
 
    const { f_userName, f_Pwd } = req.body;
    const user = await Login.findOne({ f_userName: f_userName });


    const validpassword = await bcryptsjs.compare(f_Pwd, user.f_Pwd);


    if (!validpassword) {
      return res.status(400).send({ error: "Check your credentials!" });
    }

    const tokenData = {
      id: user._id,
      username: user.f_userName,
      email: user.f_Email,
    };

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    

    // Send token to the client
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all logins
router.get("/logins", async (req, res) => {
  try {
    const logins = await Login.find();
    res.send(logins);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Employee Routes
// Create employee
// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Numeric validation
const isNumeric = (value) => {
  return /^\d+$/.test(value);
};

// Check if email already exists
const isDuplicateEmail = async (email, employee) => {
  const existingEmail = await Employee.find({ f_Email: email });
  for (let i = 0; i < existingEmail.length; i++) {
    if (existingEmail[i] !== null && !existingEmail[i]._id.equals(employee._id))
      return true;
  }
  return false;
};

// Employee Routes
// Create employee
router.post("/employees", verifyToken, async (req, res) => {
  try {
    // Validate fields
    const {
      f_Image,
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_Gender,
      f_Course,
    } = req.body;
    console.log(req.body);
    if (
      !f_Image ||
      !f_Name ||
      !f_Email ||
      !f_Mobile ||
      !f_Designation ||
      !f_Gender ||
      !f_Course
    ) {
      return res.status(400).send({ error: "All fields are required." });
    }
    if (!isValidEmail(f_Email)) {
      return res.status(400).send({ error: "Invalid email format." });
    }
    if (!isNumeric(f_Mobile)) {
      return res.status(400).send({ error: "Mobile number must be numeric." });
    }
    if (await isDuplicateEmail(f_Email)) {
      return res.status(400).send({ error: "Email already exists." });
    }

    const employee = new Employee({
      f_Id: nextSnoEmp++,
      f_Image,
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_Gender,
      f_Course,
      f_Createdate: Date.now(),
    });
    await employee.save();
    res.status(201).send(employee);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all employees
router.get("/employees", verifyToken, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.send(employees);
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get("/employees/:id", verifyToken, async (req, res) => {
  try {
    const employees = await Employee.findById(req.params.id);
    res.send(employees);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Edit employee
router.put("/employees", verifyToken, async (req, res) => {
  try {
    const {
      f_Id,
      f_Image,
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_Gender,
      f_Course,
    } = req.body;

    const employee = await Employee.findOne({ f_Id: f_Id });

    if (!employee) {
      return res.status(404).send({ error: "Employee not found." });
    }

    // Validate fields
    if (
      !f_Image ||
      !f_Name ||
      !f_Email ||
      !f_Mobile ||
      !f_Designation ||
      !f_Gender ||
      !f_Course
    ) {
      return res.status(400).send({ error: "All fields are required." });
    }
    if (!isValidEmail(f_Email)) {
      return res.status(400).send({ error: "Invalid email format." });
    }
    if (!isNumeric(f_Mobile)) {
      return res.status(400).send({ error: "Mobile number must be numeric." });
    }
    if (await isDuplicateEmail(f_Email, employee)) {
      return res.status(400).send({ error: "Email already exists." });
    }

    employee.f_Image = f_Image;
    employee.f_Name = f_Name;
    employee.f_Email = f_Email;
    employee.f_Mobile = f_Mobile;
    employee.f_Designation = f_Designation;
    employee.f_Gender = f_Gender;
    employee.f_Course = f_Course;

    await employee.save();
    res.send(employee);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
