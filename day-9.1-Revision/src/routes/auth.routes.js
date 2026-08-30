const express = require("express");

const {
  authLoginController,
  authRegisterController,
} = require("../controller/auth.controller");

const authRouter = express.Router();

authRouter.post("/register", authRegisterController);
authRouter.post("/login", authLoginController);

module.exports = { authRouter };
