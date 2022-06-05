const mongoose = require("mongoose");

const GoogleUserSchema = mongoose.Schema({
  googleId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String, required: false },
  profileType: String,
  userType: String,
});

const GoogleUser = mongoose.model("GoogleUsers", GoogleUserSchema, "users");
module.exports = GoogleUser;
