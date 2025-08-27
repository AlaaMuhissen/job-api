import ApiError from "../utils/ApiError.js";

export const validateBody =
  (schema) =>
  (req, _res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(
        new ApiError(400, "Validation failed", parsed.error.flatten())
      );
    }
    req.validated = parsed.data;
    next();
  };
