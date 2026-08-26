const express = require("express");
const {
  CreatePostController,
  getAllPostController,
} = require("../controller/post.controller");
const { checkUserMiddleware } = require("../middleware/checkUser.middleware");
const multer = require("multer");
const uplaod = multer({ storage: multer.memoryStorage() });

const postRouter = express.Router();

postRouter.post(
  "/create",
  uplaod.single("image"),
  checkUserMiddleware,
  CreatePostController,
);
postRouter.get("/getAllPost", checkUserMiddleware, getAllPostController);

module.exports = postRouter;
