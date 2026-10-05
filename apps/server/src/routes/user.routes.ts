import { Router } from "express";

import {
  followUserController,
  getFollowersController,
  getFollowingController,
  getProfileController,
  getUserPostsController,
  searchUsersController,
  unfollowUserController,
  updateProfileController,
} from "../controllers/user.controller";
import { optionalAuth, requireAuth } from "../middlewares/auth.middleware";
import { registerRoute } from "../utils/routeBuilder";
import {
  apiErrorResponseSchema,
  paginationQuerySchema,
  usernameParamSchema,
} from "../validations/common.validation";
import { paginatedPostsResponseSchema } from "../validations/post.validation";
import {
  followActionResponseSchema,
  searchUsersQuerySchema,
  updateProfileBodySchema,
  userListResponseSchema,
  userProfileResponseSchema,
} from "../validations/user.validation";

const router: Router = Router();

registerRoute(
  router,
  {
    method: "get",
    path: "/api/v1/users/search",
    summary: "Search users",
    description: "Search users by username handle or full display name.",
    tags: ["Users"],
    security: "none",
    request: {
      query: searchUsersQuerySchema,
    },
    responses: {
      "200": {
        description: "Paginated search results",
        schema: userListResponseSchema,
      },
      "400": {
        description: "Validation error",
        schema: apiErrorResponseSchema,
      },
    },
  },
  optionalAuth,
  searchUsersController,
);

registerRoute(
  router,
  {
    method: "patch",
    path: "/api/v1/users/profile",
    summary: "Update current user profile",
    description: "Update display name, biography, avatar URL, or website.",
    tags: ["Users"],
    security: "bearer",
    request: {
      body: updateProfileBodySchema,
    },
    responses: {
      "200": {
        description: "Updated profile details",
        schema: userProfileResponseSchema,
      },
      "400": {
        description: "Validation error",
        schema: apiErrorResponseSchema,
      },
      "401": {
        description: "Unauthorized",
        schema: apiErrorResponseSchema,
      },
    },
  },
  requireAuth,
  updateProfileController,
);

registerRoute(
  router,
  {
    method: "get",
    path: "/api/v1/users/:username",
    summary: "Get user profile by username",
    description: "Fetch public profile info, including stats and follow status.",
    tags: ["Users"],
    security: "none",
    request: {
      params: usernameParamSchema,
    },
    responses: {
      "200": {
        description: "User profile details",
        schema: userProfileResponseSchema,
      },
      "404": {
        description: "User not found",
        schema: apiErrorResponseSchema,
      },
    },
  },
  optionalAuth,
  getProfileController,
);

registerRoute(
  router,
  {
    method: "get",
    path: "/api/v1/users/:username/posts",
    summary: "Get posts created by a specific user",
    description: "Fetches chronological list of posts created by this user.",
    tags: ["Users", "Posts"],
    security: "none",
    request: {
      params: usernameParamSchema,
      query: paginationQuerySchema,
    },
    responses: {
      "200": {
        description: "Paginated user posts",
        schema: paginatedPostsResponseSchema,
      },
      "404": {
        description: "User not found",
        schema: apiErrorResponseSchema,
      },
    },
  },
  optionalAuth,
  getUserPostsController,
);

registerRoute(
  router,
  {
    method: "post",
    path: "/api/v1/users/:username/follow",
    summary: "Follow a user",
    description: "Follow the user identified by username.",
    tags: ["Users", "Follows"],
    security: "bearer",
    request: {
      params: usernameParamSchema,
    },
    responses: {
      "200": {
        description: "Follow action completed",
        schema: followActionResponseSchema,
      },
      "400": {
        description: "Cannot follow self or invalid username",
        schema: apiErrorResponseSchema,
      },
      "401": {
        description: "Unauthorized",
        schema: apiErrorResponseSchema,
      },
      "404": {
        description: "Target user not found",
        schema: apiErrorResponseSchema,
      },
    },
  },
  requireAuth,
  followUserController,
);

registerRoute(
  router,
  {
    method: "delete",
    path: "/api/v1/users/:username/follow",
    summary: "Unfollow a user",
    description: "Unfollow the user identified by username.",
    tags: ["Users", "Follows"],
    security: "bearer",
    request: {
      params: usernameParamSchema,
    },
    responses: {
      "200": {
        description: "Unfollow action completed",
        schema: followActionResponseSchema,
      },
      "401": {
        description: "Unauthorized",
        schema: apiErrorResponseSchema,
      },
      "404": {
        description: "Target user not found",
        schema: apiErrorResponseSchema,
      },
    },
  },
  requireAuth,
  unfollowUserController,
);

registerRoute(
  router,
  {
    method: "get",
    path: "/api/v1/users/:username/followers",
    summary: "Get user's followers",
    description: "List of accounts that follow this user.",
    tags: ["Users", "Follows"],
    security: "none",
    request: {
      params: usernameParamSchema,
      query: paginationQuerySchema,
    },
    responses: {
      "200": {
        description: "Paginated followers list",
        schema: userListResponseSchema,
      },
      "404": {
        description: "User not found",
        schema: apiErrorResponseSchema,
      },
    },
  },
  optionalAuth,
  getFollowersController,
);

registerRoute(
  router,
  {
    method: "get",
    path: "/api/v1/users/:username/following",
    summary: "Get users followed by this user",
    description: "List of accounts this user follows.",
    tags: ["Users", "Follows"],
    security: "none",
    request: {
      params: usernameParamSchema,
      query: paginationQuerySchema,
    },
    responses: {
      "200": {
        description: "Paginated following list",
        schema: userListResponseSchema,
      },
      "404": {
        description: "User not found",
        schema: apiErrorResponseSchema,
      },
    },
  },
  optionalAuth,
  getFollowingController,
);

export default router;
