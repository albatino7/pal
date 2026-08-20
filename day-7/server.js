require("dotenv").config();

const app = require("./src/app");
const connectToDB = require("./src/config/database");

connectToDB();

app.listen(process.env.PORT, () => {
  console.log(`server is Running on Port ${process.env.PORT}`);
});
