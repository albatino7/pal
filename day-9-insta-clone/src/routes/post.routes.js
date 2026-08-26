const express = require("express");
const {
  CreatePostController,
  getAllPostController,
} = require("../controller/post.controller");
const multer = require("multer");
const uplaod = multer({ storage: multer.memoryStorage() });

const postRouter = express.Router();

postRouter.post("/create", uplaod.single("image"), CreatePostController);
postRouter.get("/getAllPost", getAllPostController);

module.exports = postRouter;
