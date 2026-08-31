const { postModel } = require("../model/post.model");

const ImagekitIO = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const { userModel } = require("../model/user.model");

//image kit veryfication
const imagekitio = new ImagekitIO({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

//Post Careate cController
const postCreateController = async (req, res) => {
  const userID = req.user.userid;
  const { caption } = req.body;
  const file = req.file;
  //   console.log(file);
  //   console.log(userID);
  const userExisted = await userModel.findById({ _id: userID });

  if (!userExisted) {
    return res.status(400).json({
      message: "User Not Found At Post Conrtoller",
    });
  }

  const resultFile = await imagekitio.files.upload({
    file: await toFile(req.file.buffer),
    fileName: req.file.originalname,
  });

  const newPost = await postModel.create({
    caption: caption,
    imageUrl: resultFile.url,
    user: userExisted._id,
  });

  res.status(201).json({
    message: "post Created Sucessfully ",
    newPost,
  });
};

module.exports = { postCreateController };
