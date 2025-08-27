import ApiError from "../utils/ApiError.js";

export const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, _req, res, _next) => {
  const status = err.status || 500;
  const payload = {
    error: err.message || "Internal Server Error",
  };
  if (err.details) payload.details = err.details;
  res.status(status).json(payload);
};
