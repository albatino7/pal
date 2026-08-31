const { userModel } = require("../model/user.model");
const jwt = require("jsonwebtoken");

const checkUserMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt_token;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    return res.status(400).json({
      message: "Your Token is Invalid ",
    });
  }

  const userExisted = await userModel.findById({ _id: decoded.userid });

  if (!userExisted) {
    return res.status(400).json({
      message: "Your User id Inside Token is incorrect",
    });
  }

  req.user = decoded;

  next();
};

module.exports = { checkUserMiddleware };
