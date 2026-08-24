require("dotenv").config();
const mongoose = require("mongoose");

function connectToDB() {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => {
      console.log("connected to DB Sucessfully");
    })
    .catch((err) => {
      console.log("Unable to Connect To Db ", err);
    });
}

module.exports = connectToDB;
