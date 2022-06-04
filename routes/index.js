const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");

router.get("/", (req, res) => {
  res.send("<h1>Hello from the API!</h1>");
});

module.exports = router;
