import express from "express";
import registerController from "../controller/auth.controller.js";
import registerValidation from "../validation/registerValidation.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidation, registerController);

export default authRouter;
