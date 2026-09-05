import mongoose, { Mongoose } from "mongoose";
import config from "../config/config.js";

const connectToDB = async () => {
  await mongoose
    .connect(config.DB_URI)
    .then(() => {
      console.log("connected To Local Database");
    })
    .catch((err) => {
      console.log("unable to connect Database");
    });
};

export default connectToDB;
