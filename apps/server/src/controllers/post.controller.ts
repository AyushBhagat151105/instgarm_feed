import type { Request, RequestHandler, Response } from "express";

import { PostService } from "../services/post.service";
import { ApiError, ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const createPostController: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const post = await PostService.createPost(req.user.id, req.body);
  res.status(201).json(ApiResponse.created(post, "Post created successfully"));
});

export const getPostController: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const post = await PostService.getPostById(req.params.id as string, req.user?.id);
  res.status(200).json(ApiResponse.ok(post));
});

export const deletePostController: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  await PostService.deletePost(req.user.id, req.params.id as string);
  res.status(200).json(ApiResponse.ok(null, "Post deleted successfully"));
});
