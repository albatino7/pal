require("dotenv").config();

const app = require("./src/app");
const mongoose = require("mongoose");

function connectToDB() {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => {
      console.log("Connected To Db");
    })
    .catch((error) => {
      console.log("unbale to connect to Db");
      console.log(error);
    });
}
connectToDB();

app.listen(process.env.PORT, () => {
  console.log(`Sever is Runing on PORT : ${process.env.PORT} `);
});
