const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String, required: false },
  profileType: { type: String, required: true, default: "Manual" },
  userType: { type: String, required: true, default: "Customer" },
  rewardPoints: { type: Number, default: 100 },
  joinDate: { type: Date, default: Date.now },
});

const User = mongoose.model("Users", UserSchema, "users");
module.exports = User;
