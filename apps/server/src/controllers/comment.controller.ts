import type { Request, Response } from "express";

import { CommentService } from "../services/comment.service";
import { ApiError, ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const createCommentController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const comment = await CommentService.createComment(
    req.user.id,
    req.params.id,
    req.body.content,
  );
  res.status(201).json(ApiResponse.created(comment, "Comment added successfully"));
});

export const getPostCommentsController = asyncHandler(async (req: Request, res: Response) => {
  const result = await CommentService.getPostComments(
    req.params.id,
    req.query,
    req.user?.id,
  );
  res.status(200).json(ApiResponse.ok(result));
});

export const deleteCommentController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  await CommentService.deleteComment(
    req.user.id,
    req.params.id,
    req.params.commentId,
  );
  res.status(200).json(ApiResponse.ok(null, "Comment deleted successfully"));
});
