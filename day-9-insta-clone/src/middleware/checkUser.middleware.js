const jwt = require("jsonwebtoken");
const { redis } = require("../config/redis");

const checkUserMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt_token;

  // Redis Implimentation
  //
  const checkTokenInBlacklisted = await redis.get(token);
  if (checkTokenInBlacklisted) {
    return res.status(401).json({
      message: "Your Token is Found in Redis > You Cannot LoggedIN",
    });
  }

  let decoded;
  try {
    decoded = await jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(400).json({
      message: "token is Invalid :: From checkUserMiddleware ",
    });
  }

  req.user = decoded;

  next();
};

module.exports = { checkUserMiddleware };
