require("dotenv").config();

const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");
const postModel = require("../model/post.model");

const ImagekitIo = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const imageKitIo = new ImagekitIo({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

const CreatePostController = async (req, res) => {
  try {
    // 1. Get token from cookie
    const token = req.cookies.jwt_token;

    if (!token) {
      return res.status(401).json({
        message: "Token is required",
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded token:", decoded);

    // 3. Check user
    const user = await userModel.findById(decoded.userid);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // 4. Check image
    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    // 5. Upload image to ImageKit
    const file = await imageKitIo.files.upload({
      file: await toFile(req.file.buffer),
      fileName: req.file.originalname,
    });

    // 6. Create post
    const post = await postModel.create({
      caption: req.body.caption,
      imageUrl: file.url,
      user: decoded.userid,
    });

    // 7. Send response
    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.log("Create Post Error:", error);

    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = {
  CreatePostController,
};
