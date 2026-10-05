import type { Request, RequestHandler, Response } from "express";

import { CommentService } from "../services/comment.service";
import { ApiError, ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const createCommentController: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const comment = await CommentService.createComment(
    req.user.id,
    req.params.id as string,
    req.body.content,
  );
  res.status(201).json(ApiResponse.created(comment, "Comment added successfully"));
});

export const getPostCommentsController: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await CommentService.getPostComments(
    req.params.id as string,
    req.query,
    req.user?.id,
  );
  res.status(200).json(ApiResponse.ok(result));
});

export const deleteCommentController: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  await CommentService.deleteComment(
    req.user.id,
    req.params.id as string,
    req.params.commentId as string,
  );
  res.status(200).json(ApiResponse.ok(null, "Comment deleted successfully"));
});
