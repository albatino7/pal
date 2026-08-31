const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: true,
    default: "this is Defautl Caption",
  },
  imageUrl: {
    type: String,
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "User iD is required"],
  },
});

const postModel = mongoose.model("posts", postSchema);
module.exports = { postModel };
