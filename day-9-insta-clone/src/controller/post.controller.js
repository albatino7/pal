require("dotenv").config();

const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");
const postModel = require("../model/post.model");
const likeModel = require("../model/like.model");

const ImagekitIo = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const imageKitIo = new ImagekitIo({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

const CreatePostController = async (req, res) => {
  try {
    //getting req.user = decodec from middleware
    const userID = req.user.userid;

    // 3. Check user
    const user = await userModel.findById(userID);

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
      user: userID,
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

const getAllPostController = async (req, res) => {
  const userID = req.user.userid;

  const isUserExist = await userModel.find({ userID });

  if (!isUserExist) {
    return res.status(404).json({
      message: "user is NOT EXISTED ",
    });
  }

  const posts = await postModel.find({
    user: userID,
  });

  res.status(200).json({
    message: "post Fetched Succesfully",
    posts,
  });
};

const likePostController = async (req, res) => {
  const userID = req.user.userid;
  const postID = req.params.id;

  const postExisted = await postModel.findOne({ _id: postID });

  if (!postExisted) {
    return res.status(400).json({
      message: "unable to find post ",
    });
  }

  const alreadyLike = await likeModel.findOne({
    post: postID,
    user: userID,
  });

  if (alreadyLike) {
    return res.status(400).json({
      message: "You already like This poste",
    });
  }

  const likeDone = await likeModel.create({
    post: postID,
    user: userID,
  });

  res.status(201).json({
    message: "You Liked This Post Sucessfully",
    likeSchema: likeDone,
  });
};

const unlikePostController = async (req, res) => {
  const userID = req.user.userid;
  const postID = req.params.id;

  // console.log("USERID::", userID);

  // console.log("POSTid::", postID);

  const checkLikeEXist = await likeModel.findOne({
    post: postID,
    user: userID,
  });

  if (!checkLikeEXist) {
    return res.status(400).json({
      message: "You Not Like tHIS Post YET  ",
    });
  }

  const removeLike = await likeModel.findByIdAndDelete(checkLikeEXist._id);

  res.status(200).json({
    message: "You SuccussfULLY unLIKE tHIS POST ",
  });
};
module.exports = {
  CreatePostController,
  getAllPostController,
  likePostController,
  unlikePostController,
};
