const { userModel } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//API : api/auth/register
const authRegisterController = async (req, res) => {
  const { username, email, password, bio } = req.body;

  const userAlreadyExisted = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (userAlreadyExisted) {
    return res.status(400).json({
      message: "user  is Already Existed ",
    });
  }

  const hashPassword = await bcrypt.hash(password, 5);

  const userCreated = await userModel.create({
    username: username,
    email: email,
    password: hashPassword,
    bio: bio,
  });

  const token = jwt.sign({ userid: userCreated._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt_token", token);

  res.status(201).json({
    message: "user is Created Scuessfully",
    userCreated,
  });
};

//API : api/auth/login
const authLoginController = async (req, res) => {
  const { username, email, password } = req.body;

  const checkUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (!checkUser) {
    return res.status(400).json({
      message: "user not existed ",
    });
  }

  const checkPassword = await bcrypt.compare(password, checkUser.password);

  if (!checkPassword) {
    return res.status(200).json({
      message: "your password is Incorrect",
    });
  }

  const token = jwt.sign({ userid: checkUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("jwt_token", token);

  res.status(200).json({
    message: "Your are LogIn SucessFully ",
    checkUser,
  });
};

module.exports = { authLoginController, authRegisterController };
