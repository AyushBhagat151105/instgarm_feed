import type { Request, Response } from "express";

import { FeedService } from "../services/feed.service";
import { ApiError, ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const getHomeFeedController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const result = await FeedService.getHomeFeed(req.user.id, req.query);
  res.status(200).json(ApiResponse.ok(result));
});

export const getExploreFeedController = asyncHandler(async (req: Request, res: Response) => {
  const result = await FeedService.getExploreFeed(req.query, req.user?.id);
  res.status(200).json(ApiResponse.ok(result));
});
