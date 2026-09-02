import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
  const error = validationResult(req);

  if (error.isEmpty()) {
    return next();
  }
  res.status(400).json({ errors: error.array() });
};

export const registerValidation = [
  body("username").isString().withMessage("Username  required in String"),
  body("email").isEmail().withMessage("Email is Required"),
  validate,
];

// You can do this Also
export const registerValidation_2 = [
  body("username").isString().withMessage("username must be a character"),
  body("email").isEmail().withMessage("check your email format please"),

  (req, res, next) => {
    const error = validationResult(req);

    if (error.isEmpty()) {
      return next();
    }

    res.status(400).json({
      errors: error.array(),
    });
  },
];

export default registerValidation;
