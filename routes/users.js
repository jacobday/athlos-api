const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware");
const { token } = require("morgan");

// @route POST api/users/add
// @desc Register user
// @access Public
router.post("/add", async function (req, res) {
  const salt = await bcrypt.genSalt(10);
  var manualUser = {
    userId: new mongoose.Types.ObjectId().toString(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, salt),
    profileType: "Manual",
    userType: "Customer",
  };
  try {
    let user = await User.findOne({ email: { $eq: manualUser.email } }).exec(
      async (err, user) => {
        if (err) {
          console.log(err);
        } else {
          if (user) {
            res.status(409).send("Not Adding to Database, Already Exists");
          } else {
            manualUser = await User.create(manualUser);

            res.status(200).send("Registered User Data");
          }
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", async function (req, res) {
  try {
    let user = await User.findOne({
      email: { $eq: req.body.email },
    }).exec(async (err, user) => {
      if (err) {
        console.log(err);
      } else {
        if (user) {
          console.log("Found User\n");

          //Check Hashed Passwords
          const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
          );

          if (validPassword) {
            const payload = {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              type: user.userType,
              rewardPoints: user.rewardPoints,
            };

            // Sign Token
            jwt.sign(
              payload,
              process.env.JWT_SECRET,
              {
                expiresIn: "7d",
              },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer" + token,
                });
              }
            );

            console.log("User Login Successful");
          } else {
            console.log("Password Mismatch");
            res.status(401).send("Password is incorrect");
          }
        } else {
          res.status(404).send("Email not registered");
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
