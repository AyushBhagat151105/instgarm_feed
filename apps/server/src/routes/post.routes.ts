import { Router } from "express";

import {
  createPostController,
  deletePostController,
  getPostController,
} from "../controllers/post.controller";
import { optionalAuth, requireAuth } from "../middlewares/auth.middleware";
import { registerRoute } from "../utils/routeBuilder";
import { apiErrorResponseSchema, createApiResponseSchema } from "../validations/common.validation";
import {
  createPostBodySchema,
  postParamSchema,
  postResponseSchema,
} from "../validations/post.validation";

const router: Router = Router();

registerRoute(
  router,
  {
    method: "post",
    path: "/api/v1/posts",
    summary: "Create a new post",
    description: "Upload post with image/video media URLs, optional caption, and location.",
    tags: ["Posts"],
    security: "bearer",
    request: {
      body: createPostBodySchema,
    },
    responses: {
      "201": {
        description: "Post created successfully",
        schema: postResponseSchema,
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
  createPostController,
);

registerRoute(
  router,
  {
    method: "get",
    path: "/api/v1/posts/:id",
    summary: "Get post details",
    description: "Fetch single post by ID including likes and comments stats.",
    tags: ["Posts"],
    security: "none",
    request: {
      params: postParamSchema,
    },
    responses: {
      "200": {
        description: "Post details",
        schema: postResponseSchema,
      },
      "404": {
        description: "Post not found",
        schema: apiErrorResponseSchema,
      },
    },
  },
  optionalAuth,
  getPostController,
);

registerRoute(
  router,
  {
    method: "delete",
    path: "/api/v1/posts/:id",
    summary: "Delete a post",
    description: "Delete an existing post (only the post author is permitted).",
    tags: ["Posts"],
    security: "bearer",
    request: {
      params: postParamSchema,
    },
    responses: {
      "200": {
        description: "Post deleted successfully",
        schema: createApiResponseSchema(apiErrorResponseSchema.optional()),
      },
      "401": {
        description: "Unauthorized",
        schema: apiErrorResponseSchema,
      },
      "403": {
        description: "Forbidden - not the post author",
        schema: apiErrorResponseSchema,
      },
      "404": {
        description: "Post not found",
        schema: apiErrorResponseSchema,
      },
    },
  },
  requireAuth,
  deletePostController,
);

export default router;
