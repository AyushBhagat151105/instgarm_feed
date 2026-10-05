import type { Request, Response } from "express";

import { AuthService } from "../services/auth.service";
import { ApiError, ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const registerController = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  res.status(201).json(ApiResponse.created(result, "Account registered successfully"));
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  res.status(200).json(ApiResponse.ok(result, "Logged in successfully"));
});

export const refreshController = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.refresh(req.body.refreshToken);
  res.status(200).json(ApiResponse.ok(result, "Token refreshed successfully"));
});

export const logoutController = asyncHandler(async (req: Request, res: Response) => {
  if (req.body.refreshToken) {
    await AuthService.logout(req.body.refreshToken);
  }
  res.status(200).json(ApiResponse.ok(null, "Logged out successfully"));
});

export const meController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const user = await AuthService.getMe(req.user.id);
  res.status(200).json(ApiResponse.ok(user));
});

export const changePasswordController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  await AuthService.changePassword(req.user.id, req.body);
  res.status(200).json(ApiResponse.ok(null, "Password updated successfully"));
});
