import type { Request, Response } from "express";

import { PostService } from "../services/post.service";
import { UserService } from "../services/user.service";
import { ApiError, ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

export const getProfileController = asyncHandler(async (req: Request, res: Response) => {
  const profile = await UserService.getProfileByUsername(
    req.params.username,
    req.user?.id,
  );
  res.status(200).json(ApiResponse.ok(profile));
});

export const updateProfileController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const updated = await UserService.updateProfile(req.user.id, req.body);
  res.status(200).json(ApiResponse.ok(updated, "Profile updated successfully"));
});

export const searchUsersController = asyncHandler(async (req: Request, res: Response) => {
  const query = typeof req.query.q === "string" ? req.query.q : "";
  const result = await UserService.searchUsers(query, req.query, req.user?.id);
  res.status(200).json(ApiResponse.ok(result));
});

export const getUserPostsController = asyncHandler(async (req: Request, res: Response) => {
  const result = await PostService.getUserPosts(
    req.params.username,
    req.query,
    req.user?.id,
  );
  res.status(200).json(ApiResponse.ok(result));
});

export const followUserController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const result = await UserService.followUser(req.user.id, req.params.username);
  res.status(200).json(ApiResponse.ok(result, `Followed @${req.params.username}`));
});

export const unfollowUserController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  const result = await UserService.unfollowUser(req.user.id, req.params.username);
  res.status(200).json(ApiResponse.ok(result, `Unfollowed @${req.params.username}`));
});

export const getFollowersController = asyncHandler(async (req: Request, res: Response) => {
  const result = await UserService.getFollowers(
    req.params.username,
    req.query,
    req.user?.id,
  );
  res.status(200).json(ApiResponse.ok(result));
});

export const getFollowingController = asyncHandler(async (req: Request, res: Response) => {
  const result = await UserService.getFollowing(
    req.params.username,
    req.query,
    req.user?.id,
  );
  res.status(200).json(ApiResponse.ok(result));
});
