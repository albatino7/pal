import express from "express";
import {
  registerController,
  loginController,
} from "../controller/auth.controller.js";
import upload from "../config/multer.js";

const authRouter = express.Router();

authRouter.post("/register", upload.single("image"), registerController);
authRouter.post("/login", loginController);

export default authRouter;
