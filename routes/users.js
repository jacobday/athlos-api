const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware");

router.post("/add", async function (req, res) {
  const salt = await bcrypt.genSalt(10);
  var manualUser = {
    userId: new mongoose.Types.ObjectId().toString(),
    firstName: req.body.newUserData.firstName,
    lastName: req.body.newUserData.lastName,
    email: req.body.newUserData.email,
    password: await bcrypt.hash(req.body.newUserData.password, salt),
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

router.post("/login", async function (req, res) {
  try {
    let user = await User.findOne({
      email: { $eq: req.body.loginData.email },
    }).exec(async (err, user) => {
      if (err) {
        console.log(err);
      } else {
        if (user) {
          console.log("Found User\n");

          //Check Hashed Passwords
          const validPassword = await bcrypt.compare(
            req.body.loginData.password,
            user.password
          );

          if (validPassword) {
            let token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);

            console.log("User Login Successful");

            res
              .cookie("access_token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 900000),
              })
              .status(200)
              .json({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userType: user.userType,
                message: "Authentication Successful!",
              });
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

router.get("/logout", middleware.authorization, (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out" });
});

module.exports = router;
