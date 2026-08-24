const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  const { username, email, password } = req.body;

  const userExistAlready = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (userExistAlready) {
    res.status(400).json({
      message: "User is Already EXISTED",
    });
  }

  const hashPassword = await bcrypt.hash(password, 8);

  const user = await userModel.create({
    username: username,
    email: email,
    password: hashPassword,
  });

  const token = jwt.sign({ userid: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token);

  //
  //
  res.status(201).json({
    message: "User Created Sucessfully",
    user,
  });
};

const loginController = async (req, res) => {
  const { username, email, password } = req.body;

  const userExisted = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (!userExisted) {
    res.status(409).json({
      message: "User is Not Existed",
    });
  }

  const passwordCheck = await bcrypt.compare(password, userExisted.password);

  if (!passwordCheck) {
    return res.status(409).json({
      message: "Your Password Is Wrong ",
    });
  }

  const token = jwt.sign({ userid: userExisted._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt_token", token);

  res.status(200).json({
    message: "User is login Sucessfully ",
    userExisted,
  });
};

module.exports = { registerController, loginController };
