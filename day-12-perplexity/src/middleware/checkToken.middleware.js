import jwt from "jsonwebtoken";
import config from "../config/config.js";
import redis from "../config/redis.js";
import userModel from "../models/user.model.js";

const checkTokenMiddleware = async (req, res, next) => {
  try {
    //getting accesToken from clientSide
    const token = req.cookies.accessToken;

    //check wheather token is Present in REDIS or not
    const CheckTokenInBlackList = await redis.get(token);

    //if token is Found give Error
    if (CheckTokenInBlackList) {
      const error = new Error("Token Found In Redis BlackList ");
      error.status = 402;
      throw error;
    }

    //very token using jsonwebToken
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);

    //if token is not valid throw error
    if (!decoded) {
      const error = new Error("Token is Invalid");
      error.status = 401;

      throw error;
    }

    //searching user in db weather its is real or not
    const { userid } = decoded;
    // console.log(decoded);
    const userExisted = await userModel.findOne({
      _id: userid,
    });

    //if user is ot found in DB throw error
    if (!userExisted) {
      const error = new Error("User Is Not Existed In DB");
      error.status = 409;
      throw error;
    }
    //passing  decoded to req.user so controller get access of decoded
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export default checkTokenMiddleware;
