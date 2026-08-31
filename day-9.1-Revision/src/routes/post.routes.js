const express = require("express");
const { postCreateController } = require("../controller/postCreate.controller");
const { checkUserMiddleware } = require("../middleware/checkUser.middleware");
const { upload } = require("../config/multer");
const postRouter = express.Router();

postRouter.post(
  "/create",
  upload.single("image"),
  checkUserMiddleware,
  postCreateController,
);

module.exports = { postRouter };
