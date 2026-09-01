const express = require("express");
const { checkUserMiddleware } = require("../middleware/checkUser.middleware");
const {
  loginController,
  registerController,
  logoutController,
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

authRouter.get("/logout", checkUserMiddleware, logoutController);

module.exports = authRouter;
