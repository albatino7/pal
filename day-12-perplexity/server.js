import app from "./src/app.js";
import config from "./src/config/config.js";
import connectToDB from "./src/database/database.js";

connectToDB();

app.listen(config.PORT, () => {
  console.log("server is Running On port 3000");
});
