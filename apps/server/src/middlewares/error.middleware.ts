import type { NextFunction, Request, Response } from "express";

import logger from "../lib/logger";
import { ApiError, ApiResponse } from "../utils/api-response";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.status).json(ApiResponse.failure(err.status, err.message, err.details));
    return;
  }

  logger.error({ err }, "Unhandled server error");
  res.status(500).json(ApiResponse.internal("An unexpected internal error occurred."));
}

export default errorMiddleware;
