const express = require("express");
const {
  homeController,
  aboutController,
  serviceController,
} = require("../controller/user.controller");

const userRouter = express.Router();

userRouter.get("/", homeController);
userRouter.get("/about", aboutController);
userRouter.get("/service", serviceController);

module.exports = userRouter;
