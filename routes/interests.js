const express = require("express");
const router = express.Router();
const Interests = require("../models/Interests");
const { check } = require("express-validator");

router.post("/add", async (req, res) => {
  try {
    Interests.create(req.body).then(function () {
      res.status(200).json({
        message: "Interests added",
      });
      console.log("Interests added");
    });
  } catch (err) {
    res.status(500).json(err);
    console.log("error");
  }
});

router.post("/userinterests", async function (req, res) {
  Interests.aggregate([
    {
      $match: {
        email: req.body.email,
      },
    },
  ])
    .then((result) => {
      console.log(result);
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send("Error while retrieving interests");
    });
});

router.put("/:id", [], async (req, res) => {
  try {
    console.log(req.body);
    const modify = await Interests.findById(req.params.id);
    if (modify.email === req.body.email) {
      await modify.updateOne({ $set: req.body.trim().escape() });
      res.status(200).json("Interests has been updated");
    } else {
      res.status(403).json("You cannot modify this interest");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
