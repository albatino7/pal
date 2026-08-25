const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/*
Resgister controller
*/
const registerController = async (req, res) => {
  const { username, email, password, bio } = req.body;

  const userExist = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (userExist) {
    return res.status(400).josn({
      message: "User Already EXISTED ",
    });
  }

  const hasPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    email: email,
    username: username,
    password: hasPassword,
    bio: bio,
  });

  const token = jwt.sign({ userid: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt_token", token);

  res.status(201).json({
    message: "User is Craeted Sucessfuly",
    username: user.username,
    email: user.email,
    bio: user.bio,
    profileImage: user.profileImage,
    ID: user._id,
  });
};

/*
Login controller
*/
const loginController = async (req, res) => {
  const { username, email, password } = req.body;

  const userExist = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (!userExist) {
    return res.status(404).json({
      message: "Invaild credentials",
    });
  }

  const decodedPassword = await bcrypt.compare(password, userExist.password);
  if (!decodedPassword) {
    return res.status(400).json({
      message: "your Password is Wrong ",
    });
  }

  const token = jwt.sign({ userid: userExist._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt_token", token);

  res.status(200).json({
    message: "User login Scussfull",
    userExist,
  });
};

module.exports = { registerController, loginController };
