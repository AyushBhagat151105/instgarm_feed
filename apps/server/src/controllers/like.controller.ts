import type { Request, Response } from "express";

import { LikeService } from "../services/like.service";
import { ApiError, ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const likePostController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const result = await LikeService.likePost(req.user.id, req.params.id);
  res.status(200).json(ApiResponse.ok(result, "Post liked"));
});

export const unlikePostController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const result = await LikeService.unlikePost(req.user.id, req.params.id);
  res.status(200).json(ApiResponse.ok(result, "Post unliked"));
});

export const getPostLikesController = asyncHandler(async (req: Request, res: Response) => {
  const result = await LikeService.getPostLikes(
    req.params.id,
    req.query,
    req.user?.id,
  );
  res.status(200).json(ApiResponse.ok(result));
});
