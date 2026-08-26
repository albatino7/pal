const express = require("express");
const { checkUserMiddleware } = require("../middleware/checkUser.middleware");
const {
  followUserController,
  unfollowUserController,
} = require("../controller/follow.controller");

const followRouter = express.Router();

followRouter.post("/:id", checkUserMiddleware, followUserController);

followRouter.post("/unfollow/:id", checkUserMiddleware, unfollowUserController);

module.exports = followRouter;
