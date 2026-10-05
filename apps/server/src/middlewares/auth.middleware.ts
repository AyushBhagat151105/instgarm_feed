import type { NextFunction, Request, Response } from "express";

import prisma from "../lib/prisma";
import { ApiError } from "../utils/api-response";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new ApiError(401, "Authentication required. Please provide a valid Bearer token."));
    return;
  }

  const parts = authHeader.split(" ");
  const token = parts[1];

  if (!token) {
    next(new ApiError(401, "Invalid Bearer token format."));
    return;
  }

  const payload = verifyAccessToken(token);

  if (!payload) {
    next(new ApiError(401, "Invalid or expired access token."));
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      next(new ApiError(401, "User belonging to this token no longer exists."));
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next();
    return;
  }

  const parts = authHeader.split(" ");
  const token = parts[1];

  if (!token) {
    next();
    return;
  }

  const payload = verifyAccessToken(token);

  if (!payload) {
    next();
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatarUrl: true,
      },
    });

    if (user) {
      req.user = user;
    }
    next();
  } catch {
    next();
  }
}
