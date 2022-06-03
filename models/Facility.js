const mongoose = require('mongoose');
const FacilitySchema = mongoose.Schema({
    facilityId:{type:String,required:true},
    facilityName:{type:String,required:true},
    facilityLocation:{
        place_id:{type:String,required:true},
        street:{type:String,required:true},
        city:{type:String,required:true},
        state:{type:String,required:true},
        country:{type:String,required:true}
    },
    facilitySports:{type:String,required:true},
    facilityInformation:{type:String,required:true},
    reservationPeriodStart:{type:String,required:true},
    reservationPeriodEnd:{type:String,required:true},
    latitude:{type:Number},
    longitude:{type:Number}
})
const Facility=mongoose.model('Facility', FacilitySchema,'facilities');
module.exports=Facility