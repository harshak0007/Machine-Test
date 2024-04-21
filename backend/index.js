const express = require("express");
const cors = require("cors");
require("./connect/connect");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const employeeRouter = require("./routers/employee");
const cookieParser = require("cookie-parser");

// Use cookie-parser middleware

const app = express();
const PORT = process.env.PORT || 5000;
const corsOrigin = {
  origin: "http://localhost:3000", //or whatever port your frontend is using
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOrigin));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(employeeRouter);
// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Parse application/json
app.use(express.json());
app.use(cookieParser());

app.listen(5000, () => {
  console.log(`Api working on port ${PORT}`);
});
