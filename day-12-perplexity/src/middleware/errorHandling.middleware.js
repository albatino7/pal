const errorHandlingMiddleware = (err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "error is comming",
    stack: err.stack,
  });
};

export default errorHandlingMiddleware;
