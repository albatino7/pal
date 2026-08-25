const mongoose = require("mongoose");

const ConnectToDB = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => {
      console.log("Server is Connected TO DATABASE");
    })
    .catch((err) => {
      console.log("Unable to Connect To DB ", err);
    });
};

module.exports = ConnectToDB;
