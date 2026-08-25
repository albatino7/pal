const express = require("express");
const { CreatePostController } = require("../controller/post.controller");
const multer = require("multer");
const uplaod = multer({ storage: multer.memoryStorage() });

const postRouter = express.Router();

postRouter.post("/create", uplaod.single("image"), CreatePostController);

module.exports = postRouter;
