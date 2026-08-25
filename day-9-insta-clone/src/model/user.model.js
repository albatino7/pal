const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "Username must be unique"],
    required: [true, "username must be required"],
  },
  email: {
    type: String,
    unique: [true, "email must be unique"],
    required: [true, "email must be unique"],
  },
  password: {
    type: String,
    required: [true, "Password Should required "],
  },
  bio: String,

  profileImage: {
    type: String,
    default: "default String is here by Db ",
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
