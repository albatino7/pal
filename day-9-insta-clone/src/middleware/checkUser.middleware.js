const jwt = require("jsonwebtoken");

const checkUserMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt_token;

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
