const registerController = async (req, res, next) => {
  try {
    const userAlreadyExists = true;
    if (!userAlreadyExists) {
      const error = new Error("user already exists in DB");
      error.status = 401;

      throw error;
    }

    const token = false;

    if (!token) {
      const error = new Error("token is invalid ");
      error.status = 400;

      throw error;
    }

    res.status(200).json({
      message: "user created Sucessfully",
    });
  } catch (error) {
    next(error);
  }
};

export default registerController;
