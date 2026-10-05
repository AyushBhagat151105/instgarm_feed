import { Router } from "express";

import {
  changePasswordController,
  loginController,
  logoutController,
  meController,
  refreshController,
  registerController,
} from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { registerRoute } from "../utils/routeBuilder";
import {
  authResponseSchema,
  changePasswordBodySchema,
  loginBodySchema,
  meResponseSchema,
  refreshTokenBodySchema,
  refreshTokensResponseSchema,
  registerBodySchema,
} from "../validations/auth.validation";
import { apiErrorResponseSchema, createApiResponseSchema } from "../validations/common.validation";

const router: Router = Router();

registerRoute(
  router,
  {
    method: "post",
    path: "/api/v1/auth/register",
    summary: "Register a new user account",
    description: "Create a new user with username, email, and password. Returns user profile and initial JWT tokens.",
    tags: ["Auth"],
    security: "none",
    request: {
      body: registerBodySchema,
    },
    responses: {
      "201": {
        description: "User registered successfully",
        schema: authResponseSchema,
      },
      "400": {
        description: "Validation error or missing fields",
        schema: apiErrorResponseSchema,
      },
      "409": {
        description: "Email or username already exists",
        schema: apiErrorResponseSchema,
      },
    },
  },
  registerController,
);

registerRoute(
  router,
  {
    method: "post",
    path: "/api/v1/auth/login",
    summary: "Authenticate user and get JWT tokens",
    description: "Log in using registered email or username with password.",
    tags: ["Auth"],
    security: "none",
    request: {
      body: loginBodySchema,
    },
    responses: {
      "200": {
        description: "Login successful with user profile and tokens",
        schema: authResponseSchema,
      },
      "400": {
        description: "Validation error",
        schema: apiErrorResponseSchema,
      },
      "401": {
        description: "Invalid credentials",
        schema: apiErrorResponseSchema,
      },
    },
  },
  loginController,
);

registerRoute(
  router,
  {
    method: "post",
    path: "/api/v1/auth/refresh",
    summary: "Refresh expired access token",
    description: "Submit an active refresh token to obtain a fresh access token & refresh token pair.",
    tags: ["Auth"],
    security: "none",
    request: {
      body: refreshTokenBodySchema,
    },
    responses: {
      "200": {
        description: "New token pair issued",
        schema: refreshTokensResponseSchema,
      },
      "401": {
        description: "Invalid or expired refresh token",
        schema: apiErrorResponseSchema,
      },
    },
  },
  refreshController,
);

registerRoute(
  router,
  {
    method: "post",
    path: "/api/v1/auth/logout",
    summary: "Revoke active session/refresh token",
    description: "Revokes the provided refresh token session.",
    tags: ["Auth"],
    security: "none",
    request: {
      body: refreshTokenBodySchema,
    },
    responses: {
      "200": {
        description: "Logged out successfully",
        schema: createApiResponseSchema(apiErrorResponseSchema.optional()),
      },
    },
  },
  logoutController,
);

registerRoute(
  router,
  {
    method: "get",
    path: "/api/v1/auth/me",
    summary: "Get current authenticated user profile",
    description: "Returns the profile details of the user belonging to the Bearer token.",
    tags: ["Auth"],
    security: "bearer",
    responses: {
      "200": {
        description: "Authenticated user profile data",
        schema: meResponseSchema,
      },
      "401": {
        description: "Unauthorized - missing or invalid Bearer token",
        schema: apiErrorResponseSchema,
      },
    },
  },
  requireAuth,
  meController,
);

registerRoute(
  router,
  {
    method: "patch",
    path: "/api/v1/auth/password",
    summary: "Change account password",
    description: "Updates current password and invalidates all existing refresh sessions.",
    tags: ["Auth"],
    security: "bearer",
    request: {
      body: changePasswordBodySchema,
    },
    responses: {
      "200": {
        description: "Password updated successfully",
        schema: createApiResponseSchema(apiErrorResponseSchema.optional()),
      },
      "400": {
        description: "Incorrect current password or validation failure",
        schema: apiErrorResponseSchema,
      },
      "401": {
        description: "Unauthorized",
        schema: apiErrorResponseSchema,
      },
    },
  },
  requireAuth,
  changePasswordController,
);

export default router;
