import { Router } from "express";

import {
  createCommentController,
  deleteCommentController,
  getPostCommentsController,
} from "../controllers/comment.controller";
import { optionalAuth, requireAuth } from "../middlewares/auth.middleware";
import { registerRoute } from "../utils/routeBuilder";
import {
  commentParamSchema,
  commentResponseSchema,
  createCommentBodySchema,
  paginatedCommentsResponseSchema,
} from "../validations/comment.validation";
import {
  apiErrorResponseSchema,
  createApiResponseSchema,
  idParamSchema,
  paginationQuerySchema,
} from "../validations/common.validation";

const router: Router = Router();

registerRoute(
  router,
  {
    method: "post",
    path: "/api/v1/posts/:id/comments",
    summary: "Add comment to post",
    description: "Post a comment on a specific post.",
    tags: ["Comments"],
    security: "bearer",
    request: {
      params: idParamSchema,
      body: createCommentBodySchema,
    },
    responses: {
      "201": {
        description: "Comment added successfully",
        schema: commentResponseSchema,
      },
      "400": {
        description: "Validation error",
        schema: apiErrorResponseSchema,
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
  createCommentController,
);

registerRoute(
  router,
  {
    method: "get",
    path: "/api/v1/posts/:id/comments",
    summary: "Get comments on a post",
    description: "Retrieve chronological comments on a post.",
    tags: ["Comments"],
    security: "none",
    request: {
      params: idParamSchema,
      query: paginationQuerySchema,
    },
    responses: {
      "200": {
        description: "Paginated comments list",
        schema: paginatedCommentsResponseSchema,
      },
      "404": {
        description: "Post not found",
        schema: apiErrorResponseSchema,
      },
    },
  },
  optionalAuth,
  getPostCommentsController,
);

registerRoute(
  router,
  {
    method: "delete",
    path: "/api/v1/posts/:id/comments/:commentId",
    summary: "Delete a comment",
    description: "Delete comment by ID (allowed for comment author or post author).",
    tags: ["Comments"],
    security: "bearer",
    request: {
      params: commentParamSchema,
    },
    responses: {
      "200": {
        description: "Comment deleted successfully",
        schema: createApiResponseSchema(apiErrorResponseSchema.optional()),
      },
      "401": {
        description: "Unauthorized",
        schema: apiErrorResponseSchema,
      },
      "403": {
        description: "Forbidden - not allowed to delete this comment",
        schema: apiErrorResponseSchema,
      },
      "404": {
        description: "Comment or post not found",
        schema: apiErrorResponseSchema,
      },
    },
  },
  requireAuth,
  deleteCommentController,
);

export default router;
