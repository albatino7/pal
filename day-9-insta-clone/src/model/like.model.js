const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: [true, "Post id is required to like this post "],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "your User ID for like this Post"],
    },
  },
  { timestamps: true },
);

likeSchema.index({ post: 1, user: 1 }, { unique: true });

const likeModel = mongoose.model("likes", likeSchema);
module.exports = likeModel;
