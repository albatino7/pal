const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Follwer user id Is Required"],
    },
    followe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Followe user id IS ReQuired"],
    },
  },
  { timestamps: true },
);

followSchema.index({ follower: 1, followe: 1 }, { unique: true });
const followModel = mongoose.model("follows", followSchema);
module.exports = followModel;
