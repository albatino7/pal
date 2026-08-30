require("dotenv").config();
const mongoose = require("mongoose");

const ConnectToDB = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => {
      console.log("Connected To DB");
    })
    .catch((err) => {
      console.log("unable To Connect To Db ");
    });
};

module.exports = { ConnectToDB };
