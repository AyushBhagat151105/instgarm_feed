import { Router } from "express";

import {
  getExploreFeedController,
  getHomeFeedController,
} from "../controllers/feed.controller";
import { optionalAuth, requireAuth } from "../middlewares/auth.middleware";
import { registerRoute } from "../utils/routeBuilder";
import { apiErrorResponseSchema } from "../validations/common.validation";
import {
  feedQuerySchema,
  feedResponseSchema,
} from "../validations/feed.validation";

const router: Router = Router();

registerRoute(
  router,
  {
    method: "get",
    path: "/api/v1/feed",
    summary: "Get home feed",
    description: "Chronological feed of posts from accounts you follow and your own posts.",
    tags: ["Feed"],
    security: "bearer",
    request: {
      query: feedQuerySchema,
    },
    responses: {
      "200": {
        description: "Paginated home feed posts",
        schema: feedResponseSchema,
      },
      "401": {
        description: "Unauthorized",
        schema: apiErrorResponseSchema,
      },
    },
  },
  requireAuth,
  getHomeFeedController,
);

registerRoute(
  router,
  {
    method: "get",
    path: "/api/v1/feed/explore",
    summary: "Get explore feed",
    description: "Discover recent and popular posts from all public accounts across the platform.",
    tags: ["Feed"],
    security: "none",
    request: {
      query: feedQuerySchema,
    },
    responses: {
      "200": {
        description: "Paginated explore feed posts",
        schema: feedResponseSchema,
      },
    },
  },
  optionalAuth,
  getExploreFeedController,
);

export default router;
