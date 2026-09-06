import imageKitio from "../services/ImageKit.js";
import { toFile } from "@imagekit/nodejs";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import redis from "../config/redis.js";
import sendEmail from "../services/mail.services.js";

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
    //sending email Using nodeMailer only html
    //   await sendEmail({
    //     to: email,
    //     subject: "Welcome to Parplexity By Atul Demond",
    //     text: "Welcome to Parplexity! Your account has been created successfully.",
    //     html: `
    //   <h1>Welcome to Parplexity! new</h1>

    //   <p>Hello ${username},</p>

    //   <p>
    //     Your account has been created successfully.
    //   </p>

    //   <p>
    //     Thank you for joining us!
    //   </p>

    //   <br>

    //   <strong>Parplexity By Atul Demond</strong>
    // `,
    //   });

    //this is also sending mail but with css and good format
    await sendEmail({
      to: email,
      subject: "Welcome to Parplexity By Atul Demond",
      text: `Welcome to Parplexity, ${username}! Your account has been created successfully.`,
      html: ` <!DOCTYPE html> <html> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Welcome to Parplexity</title> </head> <body style=" margin: 0; padding: 0; background-color: #f4f7fb; font-family: Arial, Helvetica, sans-serif; "> <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f7fb; padding: 40px 15px;"> <tr> <td align="center"> <!-- Main Container --> <table width="600" cellpadding="0" cellspacing="0" border="0" style=" max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08); "> <!-- Header --> <tr> <td align="center" style=" padding: 40px 30px; background: linear-gradient(135deg, #6366f1, #8b5cf6); "> <div style=" display: inline-block; background-color: rgba(255,255,255,0.15); border-radius: 14px; padding: 12px 18px; margin-bottom: 15px; "> <span style=" color: #ffffff; font-size: 24px; font-weight: bold; "> P </span> </div> <h1 style=" margin: 0; color: #ffffff; font-size: 30px; line-height: 1.3; "> Welcome to Parplexity </h1> <p style=" margin: 10px 0 0; color: #e0e7ff; font-size: 15px; "> Your AI-powered experience starts here. </p> </td> </tr> <!-- Content --> <tr> <td style="padding: 40px 35px;"> <p style=" margin: 0 0 20px; color: #111827; font-size: 18px; font-weight: 600; "> Hello ${username}, </p> <p style=" margin: 0 0 20px; color: #4b5563; font-size: 15px; line-height: 1.7; "> We're excited to have you here! Your Parplexity account has been successfully created. </p> <!-- Success Box --> <table width="100%" cellpadding="0" cellspacing="0" border="0" style=" background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; margin: 25px 0; "> <tr> <td style="padding: 18px 20px;"> <p style=" margin: 0; color: #166534; font-size: 14px; line-height: 1.6; "> <strong>✓ Account Created Successfully</strong> <br> You can now start using Parplexity. </p> </td> </tr> </table> <p style=" margin: 0 0 25px; color: #4b5563; font-size: 15px; line-height: 1.7; "> Thank you for joining us. We hope you enjoy your experience with Parplexity! </p> <!-- Button --> <table cellpadding="0" cellspacing="0" border="0"> <tr> <td style=" border-radius: 8px; background: linear-gradient(135deg, #6366f1, #8b5cf6); " > <a href="#" style=" display: inline-block; padding: 13px 25px; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: bold; " > Get Started → </a> </td> </tr> </table> </td> </tr> <!-- Divider --> <tr> <td style="padding: 0 35px;"> <div style=" height: 1px; background-color: #e5e7eb; "></div> </td> </tr> <!-- Footer --> <tr> <td align="center" style="padding: 30px 25px;"> <p style=" margin: 0 0 8px; color: #111827; font-size: 14px; font-weight: bold; "> Parplexity By Atul Demond </p> <p style=" margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.6; "> This is an automated email. Please do not reply to this email. <br> © ${new Date().getFullYear()} Parplexity. All rights reserved. </p> </td> </tr> </table> </td> </tr> </table> </body> </html> `,
    });

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
