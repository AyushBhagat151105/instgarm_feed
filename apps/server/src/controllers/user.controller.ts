import type { Request, RequestHandler, Response } from "express";

import { PostService } from "../services/post.service";
import { UserService } from "../services/user.service";
import { ApiError, ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const getProfileController: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const profile = await UserService.getProfileByUsername(
    req.params.username as string,
    req.user?.id,
  );
  res.status(200).json(ApiResponse.ok(profile));
});

export const updateProfileController: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const updated = await UserService.updateProfile(req.user.id, req.body);
  res.status(200).json(ApiResponse.ok(updated, "Profile updated successfully"));
});

export const searchUsersController: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const query = typeof req.query.q === "string" ? req.query.q : "";
  const result = await UserService.searchUsers(query, req.query, req.user?.id);
  res.status(200).json(ApiResponse.ok(result));
});

export const getUserPostsController: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await PostService.getUserPosts(
    req.params.username as string,
    req.query,
    req.user?.id,
  );
  res.status(200).json(ApiResponse.ok(result));
});

export const followUserController: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const result = await UserService.followUser(req.user.id, req.params.username as string);
  res.status(200).json(ApiResponse.ok(result, `Followed @${req.params.username}`));
});

export const unfollowUserController: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const result = await UserService.unfollowUser(req.user.id, req.params.username as string);
  res.status(200).json(ApiResponse.ok(result, `Unfollowed @${req.params.username}`));
});

export const getFollowersController: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await UserService.getFollowers(
    req.params.username as string,
    req.query,
    req.user?.id,
  );
  res.status(200).json(ApiResponse.ok(result));
});

export const getFollowingController: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await UserService.getFollowing(
    req.params.username as string,
    req.query,
    req.user?.id,
  );
  res.status(200).json(ApiResponse.ok(result));
});
