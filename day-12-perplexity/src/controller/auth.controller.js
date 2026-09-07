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

    const token = jwt.sign(
      { useremail: users.email },
      config.EMAIL_TOKEN_SECRET,
      {
        expiresIn: "1d",
      },
    );
    //this is also sending mail but with css and good format

    const verificationLink = `http://localhost:3000/api/auth/verifyEmail?token=${token}`;

    await sendEmail({
      to: email,

      subject: "Verify Your Email — Welcome to Parplexity",

      text: `
Welcome to Parplexity, ${username}!

Your account has been created successfully.

Please verify your email address by clicking the link below:

${verificationLink}

If you did not create this account, you can safely ignore this email.

Parplexity By Atul Demond
  `,

      html: `
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Verify Your Email</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #f4f7fb;
  font-family: Arial, Helvetica, sans-serif;
">

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      background-color: #f4f7fb;
      padding: 40px 15px;
    "
  >

    <tr>
      <td align="center">

        <!-- Main Card -->
        <table
          width="600"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width: 600px;
            width: 100%;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          "
        >

          <!-- Header -->
          <tr>
            <td
              align="center"
              style="
                padding: 40px 30px;
                background: linear-gradient(
                  135deg,
                  #6366f1,
                  #8b5cf6
                );
              "
            >

              <!-- Logo -->
              <div
                style="
                  display: inline-block;
                  width: 55px;
                  height: 55px;
                  line-height: 55px;
                  background-color: rgba(255,255,255,0.18);
                  border-radius: 14px;
                  margin-bottom: 15px;
                "
              >

                <span
                  style="
                    color: #ffffff;
                    font-size: 26px;
                    font-weight: bold;
                  "
                >
                  P
                </span>

              </div>

              <h1
                style="
                  margin: 0;
                  color: #ffffff;
                  font-size: 28px;
                  line-height: 1.3;
                "
              >
                Verify Your Email
              </h1>

              <p
                style="
                  margin: 10px 0 0;
                  color: #e0e7ff;
                  font-size: 15px;
                "
              >
                One quick step to activate your account
              </p>

            </td>
          </tr>


          <!-- Content -->
          <tr>

            <td
              style="
                padding: 40px 35px;
              "
            >

              <p
                style="
                  margin: 0 0 20px;
                  color: #111827;
                  font-size: 18px;
                  font-weight: 600;
                "
              >
                Hello ${username},
              </p>


              <p
                style="
                  margin: 0 0 20px;
                  color: #4b5563;
                  font-size: 15px;
                  line-height: 1.7;
                "
              >
                Welcome to
                <strong>Parplexity</strong>!
                Your account has been created successfully.
              </p>


              <p
                style="
                  margin: 0 0 25px;
                  color: #4b5563;
                  font-size: 15px;
                  line-height: 1.7;
                "
              >
                To complete your registration and secure your account,
                please verify your email address by clicking the button below.
              </p>


              <!-- Verification Box -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  background-color: #f5f3ff;
                  border: 1px solid #ddd6fe;
                  border-radius: 12px;
                  margin: 25px 0;
                "
              >

                <tr>

                  <td
                    align="center"
                    style="
                      padding: 25px 20px;
                    "
                  >

                    <p
                      style="
                        margin: 0 0 18px;
                        color: #5b21b6;
                        font-size: 14px;
                        font-weight: 600;
                      "
                    >
                      Email Verification Required
                    </p>


                    <!-- Button -->

                    <a
                      href="${verificationLink}"
                      style="
                        display: inline-block;
                        padding: 14px 28px;
                        background: linear-gradient(
                          135deg,
                          #6366f1,
                          #8b5cf6
                        );
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 8px;
                        font-size: 15px;
                        font-weight: bold;
                      "
                    >
                      Verify My Email →
                    </a>

                  </td>

                </tr>

              </table>


              <!-- Fallback Link -->

              <p
                style="
                  margin: 25px 0 8px;
                  color: #6b7280;
                  font-size: 12px;
                  line-height: 1.6;
                "
              >
                If the button doesn't work, copy and paste the following
                link into your browser:
              </p>


              <p
                style="
                  margin: 0;
                  padding: 12px;
                  background-color: #f9fafb;
                  border-radius: 8px;
                  word-break: break-all;
                  color: #6366f1;
                  font-size: 12px;
                "
              >
                ${verificationLink}
              </p>


              <!-- Security Notice -->

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  margin-top: 25px;
                "
              >

                <tr>

                  <td
                    style="
                      padding: 15px;
                      background-color: #fff7ed;
                      border-left: 4px solid #f97316;
                      border-radius: 6px;
                    "
                  >

                    <p
                      style="
                        margin: 0;
                        color: #9a3412;
                        font-size: 12px;
                        line-height: 1.6;
                      "
                    >
                      <strong>Security Notice:</strong>
                      If you did not create a Parplexity account,
                      you can safely ignore this email.
                    </p>

                  </td>

                </tr>

              </table>


              <p
                style="
                  margin: 30px 0 0;
                  color: #4b5563;
                  font-size: 15px;
                  line-height: 1.7;
                "
              >
                Thank you for joining us!
              </p>


              <p
                style="
                  margin: 5px 0 0;
                  color: #111827;
                  font-size: 14px;
                  font-weight: bold;
                "
              >
                Parplexity Team
              </p>

            </td>

          </tr>


          <!-- Divider -->

          <tr>

            <td style="padding: 0 35px;">

              <div
                style="
                  height: 1px;
                  background-color: #e5e7eb;
                "
              ></div>

            </td>

          </tr>


          <!-- Footer -->

          <tr>

            <td
              align="center"
              style="
                padding: 30px 25px;
              "
            >

              <p
                style="
                  margin: 0 0 8px;
                  color: #111827;
                  font-size: 14px;
                  font-weight: bold;
                "
              >
                Parplexity By Atul Demond
              </p>


              <p
                style="
                  margin: 0;
                  color: #9ca3af;
                  font-size: 12px;
                  line-height: 1.6;
                "
              >
                This is an automated email.
                Please do not reply to this email.
                <br>

                © ${new Date().getFullYear()}
                Parplexity. All rights reserved.
              </p>

            </td>

          </tr>

        </table>

      </td>
    </tr>

  </table>

</body>

</html>
  `,
    });

    // res.cookie("accessToken", token);
    res.status(201).json({
      message:
        "Your account has been created successfully. Please verify your email address to activate your account and log in.",
      users,
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmailController = async (req, res, next) => {
  try {
    const { token } = req.query;
    const decoded = await jwt.verify(token, config.EMAIL_TOKEN_SECRET);

    if (!decoded) {
      const error = new Error("Invalid Token or User Not register");
      error.status = 401;
      throw error;
    }

    const user = await userModel.findOne({ email: decoded.useremail });
    if (!user) {
      const error = new Error("Unable to find user from Token ");
      error.status = 401;
      throw error;
    }

    user.verified = true;
    await user.save();

    return res.status(200).send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <title>Email Verified - Parplexity</title>
    </head>

    <body style="
      margin: 0;
      padding: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #eef2ff, #f5f3ff);
      font-family: Arial, Helvetica, sans-serif;
    ">

      <div style="
        width: 90%;
        max-width: 500px;
        background: #ffffff;
        padding: 45px 35px;
        text-align: center;
        border-radius: 20px;
        box-shadow: 0 15px 40px rgba(0,0,0,0.12);
      ">

        <!-- Success Icon -->
        <div style="
          width: 75px;
          height: 75px;
          margin: 0 auto 20px;
          border-radius: 50%;
          background: #dcfce7;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #16a34a;
          font-size: 40px;
          font-weight: bold;
        ">
          ✓
        </div>

        <h1 style="
          margin: 0 0 15px;
          color: #111827;
          font-size: 30px;
        ">
          Email Verified Successfully!
        </h1>

        <p style="
          margin: 0 0 10px;
          color: #4b5563;
          font-size: 16px;
          line-height: 1.7;
        ">
          Congratulations! Your email address has been successfully verified.
        </p>

        <p style="
          margin: 0 0 30px;
          color: #6b7280;
          font-size: 15px;
          line-height: 1.6;
        ">
          Your Parplexity account is now active. You can safely close this
          page and log in to your account.
        </p>

        <div style="
          padding: 15px;
          background: #f5f3ff;
          border-radius: 10px;
          color: #6d28d9;
          font-size: 14px;
          font-weight: 600;
        ">
          You can now log in and start exploring Parplexity.
        </div>

        <p style="
          margin-top: 30px;
          color: #9ca3af;
          font-size: 13px;
        ">
          © ${new Date().getFullYear()} Parplexity By Atul Demond
        </p>

      </div>

    </body>
  </html>
`);
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

    if (checkUser.verified == false) {
      const error = new Error("Please Verify Your Email ");
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

const getUserDetailController = async (req, res, next) => {
  try {
    const userID = req.user.userid;

    // console.log(userID);

    const usersDetails = await userModel.findOne({ _id: userID });
    if (!usersDetails) {
      const error = new Error("Unable to Find User in DB");
      error.status = 401;
      throw error;
    }

    res.status(200).json({
      message: "You can Access Your Protected Routes ",
      usersDetails,
    });
  } catch (error) {
    next(error);
  }
};
export {
  registerController,
  loginController,
  logoutController,
  getUserDetailController,
  verifyEmailController,
};
