import jwt from "jsonwebtoken";
import config from "../config/config.js";

const checkTokenMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);

    if (!decoded) {
      const error = new Error("Token is Invalid");
      error.status = 401;

      throw error;
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export default checkTokenMiddleware;
