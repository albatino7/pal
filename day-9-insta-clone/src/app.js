const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const followRouter = require("./routes/follow.routes");

app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/follow", followRouter);

module.exports = app;
