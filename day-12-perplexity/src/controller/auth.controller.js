import imageKitio from "../services/ImageKit.js";
import { toFile } from "@imagekit/nodejs";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import redis from "../config/redis.js";

const registerController = async (req, res, next) => {
  try {
    const { username, email, password, bio, name } = req.body;
    const file = req.file;

    const isUserExisted = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserExisted) {
      const error = new Error("User Already Existed");
      error.status = 401;
      throw error;
    }

    const resultFile = await imageKitio.files.upload({
      file: await toFile(req.file.buffer),
      fileName: req.file.originalname,
    });

    if (!resultFile) {
      const error = new Error("Unable to Upload files at ImageKIT");
      error.status = 404;
      throw error;
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const users = await userModel.create({
      name: name,
      username: username,
      email: email,
      password: hashPassword,
      bio: bio,
      profile_image_url: resultFile.url,
    });

    if (!users) {
      const error = new Error("Unable create User");
      error.status = 400;
      throw error;
    }
    const token = jwt.sign({ userid: users._id }, config.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("accessToken", token);
    res.status(201).json({
      message: "user Register Sucessfully",
      users,
    });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // stiil we need both value for login email and username both for now we update its later
    const checkUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (!checkUser) {
      const error = new Error("username or email is not found");
      error.status = 401;
      throw error;
    }

    const checkPassword = await bcrypt.compare(password, checkUser.password);
    if (!checkPassword) {
      const error = new Error("Your Password Is Wrong ");
      error.status = 401;
      throw error;
    }
    const token = jwt.sign(
      { userid: checkUser._id },
      config.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" },
    );
    // console.log(token);

    res.cookie("accessToken", token);

    res.status(200).json({
      message: "User log In Scuessfull",
      checkUser,
    });
  } catch (error) {
    next(error);
  }
};

const logoutController = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    const userID = req.user.userid;
    console.log(token);

    const userExisted = await userModel.findOne({
      _id: userID,
    });

    if (!userExisted) {
      const error = new Error("User id is not existed In DB");
      error.status = 400;
      throw error;
    }

    await redis.set(token, Date.now().toString());

    res.clearCookie("accessToken");

    res.status(200).json({
      message: "user Logout Sucessfully",
    });
  } catch (error) {
    next(error);
  }
};

const protectedController = async (req, res, next) => {
  const userID = req.user.userid;
  console.log(userID);
  res.status(200).json({
    message: "You can Access Your Protected Routes ",
  });
};
export {
  registerController,
  loginController,
  logoutController,
  protectedController,
};
