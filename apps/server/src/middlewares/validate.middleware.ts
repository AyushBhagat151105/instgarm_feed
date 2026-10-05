import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodType } from "zod";

import { ApiError } from "../utils/api-response";

export interface ValidationSchemas {
  body?: ZodType<any>;
  query?: ZodType<any>;
  params?: ZodType<any>;
  headers?: ZodType<any>;
}

export function validateRequest(schemas: ValidationSchemas): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const validationErrors: Array<{ target: string; field: string; message: string }> = [];

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          validationErrors.push({
            target: "params",
            field: issue.path.join("."),
            message: issue.message,
          });
        });
      } else {
        req.params = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          validationErrors.push({
            target: "query",
            field: issue.path.join("."),
            message: issue.message,
          });
        });
      } else {
        req.query = result.data;
      }
    }

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          validationErrors.push({
            target: "body",
            field: issue.path.join("."),
            message: issue.message,
          });
        });
      } else {
        req.body = result.data;
      }
    }

    if (validationErrors.length > 0) {
      next(new ApiError(400, "Invalid request payload", validationErrors));
      return;
    }

    next();
  };
}
