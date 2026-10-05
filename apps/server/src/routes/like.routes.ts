import { Router } from "express";

import {
  getPostLikesController,
  likePostController,
  unlikePostController,
} from "../controllers/like.controller";
import { optionalAuth, requireAuth } from "../middlewares/auth.middleware";
import { registerRoute } from "../utils/routeBuilder";
import {
  apiErrorResponseSchema,
  paginationQuerySchema,
} from "../validations/common.validation";
import {
  likeListResponseSchema,
  likeParamSchema,
  likeToggleResponseSchema,
} from "../validations/like.validation";

const router: Router = Router();

registerRoute(
  router,
  {
    method: "post",
    path: "/api/v1/posts/:id/like",
    summary: "Like a post",
    description: "Add a like to a post (idempotent).",
    tags: ["Likes"],
    security: "bearer",
    request: {
      params: likeParamSchema,
    },
    responses: {
      "200": {
        description: "Post liked",
        schema: likeToggleResponseSchema,
      },
      "401": {
        description: "Unauthorized",
        schema: apiErrorResponseSchema,
      },
      "404": {
        description: "Post not found",
        schema: apiErrorResponseSchema,
      },
    },
  },
  requireAuth,
  likePostController,
);

registerRoute(
  router,
  {
    method: "delete",
    path: "/api/v1/posts/:id/like",
    summary: "Unlike a post",
    description: "Remove like from a post.",
    tags: ["Likes"],
    security: "bearer",
    request: {
      params: likeParamSchema,
    },
    responses: {
      "200": {
        description: "Post unliked",
        schema: likeToggleResponseSchema,
      },
      "401": {
        description: "Unauthorized",
        schema: apiErrorResponseSchema,
      },
      "404": {
        description: "Post not found",
        schema: apiErrorResponseSchema,
      },
    },
  },
  requireAuth,
  unlikePostController,
);

registerRoute(
  router,
  {
    method: "get",
    path: "/api/v1/posts/:id/likes",
    summary: "Get users who liked a post",
    description: "List users who gave a like to this post.",
    tags: ["Likes"],
    security: "none",
    request: {
      params: likeParamSchema,
      query: paginationQuerySchema,
    },
    responses: {
      "200": {
        description: "Paginated list of users who liked the post",
        schema: likeListResponseSchema,
      },
      "404": {
        description: "Post not found",
        schema: apiErrorResponseSchema,
      },
    },
  },
  optionalAuth,
  getPostLikesController,
);

export default router;
