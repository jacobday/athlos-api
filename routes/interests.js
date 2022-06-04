const express = require("express");
const router = express.Router();
const Interests = require("../models/Interests");
// const Facility = require("../models/Facility");

// router.post('/', function(req, res, next){
//     const user =  User.findOne({email: req.body.email});
//     user && res.status(404).json("please log in to book");
//     const newbooking = new Booking(req.body);
//     Booking.create(req.body).then(function(bookings){
//         res.send(bookings);
//     }).catch(next);
// });

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

router.put("/:id", async (req, res) => {
  try {
    const modify = await Interests.findById(req.params.id);
    if (modify.email === req.body.email) {
      await modify.updateOne({ $set: req.body });
      res.status(200).json("Interests has been updated");
    } else {
      res.status(403).json("You cannot modify this Interests");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.delete("/delete/:id", async(req,res)=>{
//     console.log(req.params.id)
//     Booking.findByIdAndDelete(req.params.id).then((booking)=>{

//         if(!booking){
//             return res.status(404).send("Booking ID Invalid")
//         }
//         res.status(200).send("Booking Deleted")
//     }).catch((err)=>{
//         res.status(500).send(err)
//     })
// });

module.exports = router;

// router.put("/:id", async(req,res)=>{
//     if(req.body.bookId === req.params.id || req.user.isAdmin){
//         if( req.body.password){
//             try{
//                 const salt = await bcrypt.genSalt(10);
//                 req.body.password = await bcrypt.hash(req.body.password, salt);
//             }catch(err){
//                 return res.status(500).json(err);
//             }
//         }
//         try{
//             const user = await User.findByIdAndUpdate(req.params.id, {
//                 $set: req.body,
//             });
//             res.status(200).json("Account has been updated");
//         }catch(err){
//             return res.status(500).json(err);
//         }
//     }else{
//         return res.status(403).json("You can update only your account!");
//     }
// });
