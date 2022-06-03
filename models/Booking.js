const mongoose = require("mongoose");

const BookingSchema = mongoose.Schema({
  facilityID:{type:String,required:true},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String },
  gear: { type: Array, default: [] },
  upgrade: {
    type: Array,
    default: [],
  },
  intime: {
    type: Number,
    min: 0,
    max: 23,
  },
  outtime: {
    type: Number,
    min: 0,
    max: 23,
  },
  totalAmount: {type: Number, required: true}
});

const Booking = mongoose.model("bookings", BookingSchema);
module.exports = Booking;
