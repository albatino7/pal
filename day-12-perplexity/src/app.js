import express from "express";
import cookieParser from "cookie-parser";
import errorHandlingMiddleware from "./middleware/errorHandling.middleware.js";
const app = express();

app.use(express.json());
app.use(cookieParser());

//import Routes
import authRouter from "./routes/auth.routes.js";

//defining Routes

app.use("/api/auth", authRouter);

//Handle error when happenn at Global Level
app.use(errorHandlingMiddleware);
export default app;
