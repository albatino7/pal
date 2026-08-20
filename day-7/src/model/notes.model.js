const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
  title: String,
  discrption: String,
});

const noteModel = mongoose.model("notes", noteSchema);
module.exports = noteModel;
