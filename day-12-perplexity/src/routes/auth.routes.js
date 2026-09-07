import express from "express";
import {
  registerController,
  loginController,
  logoutController,
  getUserDetailController,
  verifyEmailController,
} from "../controller/auth.controller.js";
import checkTokenMiddleware from "../middleware/checkToken.middleware.js";
import loginValidation from "../validation/loginValidation.js";
import registerValidation from "../validation/registerValidation.js";
import upload from "../config/multer.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  upload.single("image"),
  registerValidation,
  registerController,
);
authRouter.get("/verifyEmail", verifyEmailController);
authRouter.post("/login", loginValidation, loginController);
authRouter.get("/logout", checkTokenMiddleware, logoutController);
authRouter.get("/getUser", checkTokenMiddleware, getUserDetailController);

export default authRouter;
