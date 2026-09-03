import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

/**
 * Оборачивает async-контроллер: любые reject/throw
 * улетают в централизованный errorHandler через next(err).
 * Позволяет писать контроллеры без try/catch.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * Централизованный обработчик ошибок.
 * Подключается ПОСЛЕ всех роутов:  app.use(errorHandler)
 */
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log("Error: ", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [],
  });
};