const express = require('express');
const router = express.Router();
const Booking = require("../models/Booking");
const Facility = require("../models/Facility")


// router.post('/', function(req, res, next){
//     const user =  User.findOne({email: req.body.email});
//     user && res.status(404).json("please log in to book");
//     const newbooking = new Booking(req.body);
//     Booking.create(req.body).then(function(bookings){
//         res.send(bookings);
//     }).catch(next);
// });

router.post("/add", async (req,res)=>{
    
    try{
        Booking.create(req.body).then(function(){
            res.status(200).json({
                message:"Booking done"
            });
            console.log("booking successful")
        });
    }catch (err){
        res.status(500).json(err);
        console.log("error")
    }
});

router.get("/booked_slots",async function (req,res){
    Booking.find({}, {"intime": 1, "outtime": 1, "facilityID":1 }).then((book)=>{
        res.status(200).send(book)
        // res.status(200).json(book)
    }).catch((err)=>{
        res.status(500).send(err)
    })
})

router.post("/userbookings",async function(req,res){
    Booking.aggregate([
        {
            $lookup:{
                from:"facilities",
                localField:"facilityID",
                foreignField:"facilityId",
                as:"facility_info"
            }
        },
        {
            $unwind:"$facility_info"
        },{
            $match:{
                "email":req.body.email
            }
        }

    ]).then((result)=>{
        console.log(result)
        res.status(200).send(result)
    }).catch((err)=>{
        console.log(err)
        res.status(404).send("Error while retrieving booking")
    })

    //console.log(req.body)
    // Booking.find({email:req.body.email}).exec(async (err,bookings)=>{
    //     if(err){
    //         console.log(err)
    //         res.status(404).send("Error Retrieving Booking")
    //     }
    //     else{
    //         let data=[]
    //         if(bookings){
                
    //             for(let booking of bookings){
    //                 //console.log(booking)
    //                 Facility.find({facilityId:booking.facilityID}).exec(async (error,facility)=>{
    //                     if(error){
    //                         console.log(error)
    //                         res.status(404).send("Could not find Facility")
                            
    //                     }
    //                     else{
    //                         if(facility){
    //                             //console.log(facility)
    //                             data.push({booking:booking,facility:facility[0]})
    //                             //console.log(data)
    //                         }
    //                         else{
    //                             res.status(404).send("Could not find Facility")
    //                         }
    //                     }
    //                 })
    //             }
    //             console.log(data)
                
    //         }
    //         else{
    //             res.status(204).send("No Bookings found")
    //         }
    //     }

    // })
})




router.put("/:id", async(req,res)=>{
    try{
        const modify = await Booking.findById(req.params.id);
        if(modify.email === req.body.email){
            await modify.updateOne({$set:req.body})
            res.status(200).json("booking has been updated");
        }else{
            res.status(403).json("You cannot modify this booking");
        }
    }catch(err){
        res.status(500).json(err);
    } 
});

router.delete("/delete/:id", async(req,res)=>{
    console.log(req.params.id)
    Booking.findByIdAndDelete(req.params.id).then((booking)=>{
        
        if(!booking){
            return res.status(404).send("Booking ID Invalid")
        }
        res.status(200).send("Booking Deleted")
    }).catch((err)=>{
        res.status(500).send(err)
    })
});

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
