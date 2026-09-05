import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    errors: errors.array(),
  });
};

const loginValidation = [
  body("username").optional().trim(),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password").notEmpty().withMessage("Password is required"),

  // username OR email must exist
  (req, res, next) => {
    const { username, email } = req.body;

    if (!username && !email) {
      return res.status(400).json({
        message: "Username or email is required Must",
      });
    }

    next();
  },

  validate,
];

export default loginValidation;
