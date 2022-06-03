const express = require('express');
const router = express.Router();
const Promotion = require("../models/Promotion");


router.post("/add", async (req,res)=>{
    
    try{
        Promotion.create(req.body).then(function(){
            res.status(200).json({
                message:"Promotion added"
            });
            console.log("promotion added")
        });
    }catch (err){
        res.status(500).json(err);
        console.log("error")
    }
});

router.get("/promos",async function (req,res){
    Promotion.find({}).then((promotion)=>{
        res.status(200).send(promotion)
    }).catch((err)=>{
        res.status(500).send(err)
    })
})


router.delete("/delete/:id", async(req,res)=>{
    console.log(req.params.id)
    Promotion.findByIdAndDelete(req.params.id).then((promotion)=>{
        
        if(!promotion){
            return res.status(404).send("Promotion ID Invalid")
        }
        res.status(200).send("Promotion Deleted")
    }).catch((err)=>{
        res.status(500).send(err)
    })
});

module.exports = router;