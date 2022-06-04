const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Facility = require("../models/Facility");

router.post("/add", async (req, res) => {
  try {
    Booking.create(req.body).then(function () {
      res.status(200).json({
        message: "Booking done",
      });
      console.log("booking successful");
    });
  } catch (err) {
    res.status(500).json(err);
    console.log("error");
  }
});

router.get("/booked_slots", async function (req, res) {
  Booking.find({}, { intime: 1, outtime: 1, facilityID: 1 })
    .then((book) => {
      res.status(200).send(book);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post("/userbookings", async function (req, res) {
  Booking.aggregate([
    {
      $lookup: {
        from: "facilities",
        localField: "facilityID",
        foreignField: "facilityId",
        as: "facility_info",
      },
    },
    {
      $unwind: "$facility_info",
    },
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
      res.status(404).send("Error while retrieving booking");
    });
});

router.put("/:id", async (req, res) => {
  try {
    const modify = await Booking.findById(req.params.id);
    if (modify.email === req.body.email) {
      await modify.updateOne({ $set: req.body });
      res.status(200).json("booking has been updated");
    } else {
      res.status(403).json("You cannot modify this booking");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/delete/:id", async (req, res) => {
  console.log(req.params.id);
  Booking.findByIdAndDelete(req.params.id)
    .then((booking) => {
      if (!booking) {
        return res.status(404).send("Booking ID Invalid");
      }
      res.status(200).send("Booking Deleted");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
