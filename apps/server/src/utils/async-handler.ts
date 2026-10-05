import type { NextFunction, Request, RequestHandler, Response } from "express";

type AsyncRequestHandler<Req extends Request = Request, Res extends Response = Response> = (
  req: Req,
  res: Res,
  next: NextFunction,
) => Promise<unknown>;

/**
 * Wraps an async route handler so rejected promises reach the global error
 * handler instead of becoming unhandled rejections.
 */
export function asyncHandler<Req extends Request = Request, Res extends Response = Response>(
  handler: AsyncRequestHandler<Req, Res>,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    void handler(req as Req, res as Res, next).catch(next);
  };
}
