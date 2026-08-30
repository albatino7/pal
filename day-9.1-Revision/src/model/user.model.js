const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "User name is required "],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email Is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password Is required"],
  },
  bio: {
    type: String,
    required: [true, "This field is Required"],
  },
});

const userModel = mongoose.model("users", UserSchema);

module.exports = { userModel };
