import type { Request, Response } from "express";

import { PostService } from "../services/post.service";
import { ApiError, ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const createPostController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const post = await PostService.createPost(req.user.id, req.body);
  res.status(201).json(ApiResponse.created(post, "Post created successfully"));
});

export const getPostController = asyncHandler(async (req: Request, res: Response) => {
  const post = await PostService.getPostById(req.params.id, req.user?.id);
  res.status(200).json(ApiResponse.ok(post));
});

export const deletePostController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  await PostService.deletePost(req.user.id, req.params.id);
  res.status(200).json(ApiResponse.ok(null, "Post deleted successfully"));
});
