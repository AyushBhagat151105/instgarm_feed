import type { Request, RequestHandler, Response } from "express";

import { LikeService } from "../services/like.service";
import { ApiError, ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const likePostController: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const result = await LikeService.likePost(req.user.id, req.params.id as string);
  res.status(200).json(ApiResponse.ok(result, "Post liked"));
});

export const unlikePostController: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const result = await LikeService.unlikePost(req.user.id, req.params.id as string);
  res.status(200).json(ApiResponse.ok(result, "Post unliked"));
});

export const getPostLikesController: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await LikeService.getPostLikes(
    req.params.id as string,
    req.query,
    req.user?.id,
  );
  res.status(200).json(ApiResponse.ok(result));
});
