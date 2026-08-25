const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: [true, "please provide us Caption"],
    default: "deafult Caption",
  },
  imageUrl: {
    type: String,
    required: [true, "please Povide use Image Url "],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "Object is MUST fOR pOST "],
  },
});

const postModel = mongoose.model("posts", postSchema);
module.exports = postModel;
