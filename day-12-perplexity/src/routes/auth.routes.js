import express from "express";
import {
  registerController,
  loginController,
  logoutController,
  protectedController,
} from "../controller/auth.controller.js";
import checkTokenMiddleware from "../middleware/checkToken.middleware.js";
import loginValidation from "../validation/loginValidation.js";
import upload from "../config/multer.js";

const authRouter = express.Router();

authRouter.post("/register", upload.single("image"), registerController);
authRouter.post("/login", loginValidation, loginController);
authRouter.get("/logout", checkTokenMiddleware, logoutController);
authRouter.get("/protected", checkTokenMiddleware, protectedController);

export default authRouter;
