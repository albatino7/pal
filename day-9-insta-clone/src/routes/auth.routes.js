const express = require("express");
const {
  loginController,
  registerController,
} = require("../controller/auth.controller");

const authRouter = express.Router();

/*

POST:: api/auth/register

*/
authRouter.post("/register", registerController);

/*

POST:: api/auth/login

*/
authRouter.post("/login", loginController);

module.exports = authRouter;
