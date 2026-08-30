require("dotenv").config();
const app = require("./src/app");
const { ConnectToDB } = require("./src/config/database");

ConnectToDB();

app.listen(process.env.PORT, () => {
  console.log("Server is Running On PORT :: ", process.env.PORT);
});
