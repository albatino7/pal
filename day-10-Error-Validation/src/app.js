import express from "express";
import errorHandlingMiddleware from "./middleware/Errorhandling.middleware.js";
const app = express();

app.use(express.json());

import authRoutes from "./routes/auth.routes.js";

app.use("/api/auth", authRoutes);

app.use(errorHandlingMiddleware);

export default app;
