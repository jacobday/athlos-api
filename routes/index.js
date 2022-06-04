const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");

router.get("/", (req, res) => {
  res.sendFile("views/index.html", { root: __dirname });
});

module.exports = router;
