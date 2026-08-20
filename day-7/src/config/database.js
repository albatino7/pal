require("dotenv").config();
const mongoose = require("mongoose");

function ConnectToDB() {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => {
      console.log("Server is Connected To DB Sucessfully ");
    })
    .catch((error) => {
      console.log("Unable to connect to DB ");
      console.log(error);
    });
}

module.exports = ConnectToDB;
