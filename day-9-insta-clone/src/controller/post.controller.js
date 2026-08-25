require("dotenv").config();

const ImagekitIo = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const imageKitIo = new ImagekitIo({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

const CreatePostController = async (req, res) => {
  console.log(req.body, req.file);

  const file = await imageKitIo.files.upload({
    file: await toFile(req.file.buffer),
    fileName: req.file.originalname,
  });
  console.log(req.body, req.file);
  res.send(file);
};

module.exports = { CreatePostController };
