const mongoose = require("mongoose");

const InterestsSchema = mongoose.Schema({
  email: { type: String, required: true },
  interest: { type: Array, default: [] },
  // firstInterest: {type:String},
  // secondInterest: {type: String}
});

const Interests = mongoose.model("interests", InterestsSchema);
module.exports = Interests;
