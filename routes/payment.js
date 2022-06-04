const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Payment = require("../models/Payment");

router.post("/add", async function (req, res) {
  const salt = await bcrypt.genSalt(10);
  //rsconsole.log(req.body)
  var paymentObject = {
    userEmail: req.body.userEmail,
    cardHolderName: req.body.cardHolderName,
    cardNumber: await bcrypt.hash(req.body.cardNumber, salt),
    cvv: await bcrypt.hash(req.body.cvv, salt),
    cardExpiry: req.body.cardExpiry,
    billingLocation: {
      streetAddress: req.body.billingLocation.streetAddress,
      streetAddress2: req.body.billingLocation.streetAddress2 || "",
      city: req.body.billingLocation.city,
      state: req.body.billingLocation.state,
      country: req.body.billingLocation.country,
      zipcode: req.body.billingLocation.zipcode,
    },
    promotionUsed: req.body.promotionUsed || "No Promotion Used",
    rewardPointsUsed: req.body.rewardPointsUsed,
  };
  try {
    //console.log(googleUser)
    let pMethod = await Payment.findOne({
      email: paymentObject.userEmail,
    }).exec(async (err, payMethod) => {
      if (err) {
        console.log(err);
        //googleUser =GoogleUser.create(googleUser).exec()
      } else {
        if (pMethod) {
          payMethod = await Payment.create(paymentObject);
          res.status(409).json({
            message:
              "Credit card details already exist for the user..Adding a new one",
          });
        } else {
          payMethod = await Payment.create(paymentObject);
          res.status(200).send("Payment Method Added");
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/getpaymethod", async (req, res) => {
  Payment.find({ userEmail: req.body.email })
    .then((pMethods) => {
      res.status(200).json(pMethods);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.put("/update/:id", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  try {
    Payment.findByIdAndUpdate(req.params.id, {
      userEmail: req.body.userEmail,
      cardHolderName: req.body.cardHolderName,
      cardNumber: req.body.cardNumber,
      cvv: await bcrypt.hash(req.body.cvv, salt),
      cardExpiry: req.body.cardExpiry,
      billingLocation: {
        streetAddress: req.body.billingLocation.streetAddress,
        streetAddress2: req.body.billingLocation.streetAddress2 || "",
        city: req.body.billingLocation.city,
        state: req.body.billingLocation.state,
        country: req.body.billingLocation.country,
        zipcode: req.body.billingLocation.zipcode,
      },
    })
      .then((response) => {
        console.log(response);
        res.status(200).send("Payment Details Updated");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
