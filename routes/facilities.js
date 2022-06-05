const express = require("express");
const router = express.Router();
const { default: mongoose } = require("mongoose");
const Facility = require("../models/Facility");

router.get("/", async function (req, res) {
  Facility.find({})
    .then((facilities) => {
      res.status(200).json(facilities);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post("/add", async function (req, res) {
  console.log(req.body);
  var address = req.body.newFacilityData.facilityLocation.address.split(",");
  let street = "";
  let city = "";
  let state = "";
  let country = "";

  if (address.length == 4) {
    street = address[0];
    city = address[1];
    state = address[2];
    country = address[3];
  } else {
    street = address[0] + "," + address[1];
    city = address[2];
    state = address[3];
    country = address[4];
  }

  var manualFacility = {
    facilityId: new mongoose.Types.ObjectId().toString(),
    facilityName: req.body.newFacilityData.facilityName,
    facilityLocation: {
      place_id: req.body.newFacilityData.facilityLocation.place_id,
      street: street,
      city: city,
      state: state,
      country: country,
    },
    facilitySports: req.body.newFacilityData.facilitySport,
    facilityInformation: req.body.newFacilityData.facilityInfo,
    reservationPeriodStart: req.body.newFacilityData.reservationPeriodStart,
    reservationPeriodEnd: req.body.newFacilityData.reservationPeriodEnd,
    latitude: req.body.newFacilityData.latitude,
    longitude: req.body.newFacilityData.longitude,
  };
  try {
    let facility = await Facility.findOne({
      "facilityLocation.place_id": {
        $eq: manualFacility.facilityLocation.place_id,
      },
    }).exec(async (err, facility) => {
      if (err) {
        console.log(err);
      } else {
        if (facility) {
          res.status(409).send("Facility Already Exists");
        } else {
          createdFacility = await Facility.create(manualFacility);
          res.status(200).json({
            message: "Added Successfully",
            facility: manualFacility,
          });
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.delete("/delete/:id", async (req, res) => {
  console.log(req.params.id);
  Facility.deleteOne({ facilityId: req.params.id })
    .then((facility) => {
      if (!facility) {
        return res.status(404).send("Facility ID Invalid");
      }
      res.status(204).send("Facility Deleted");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
