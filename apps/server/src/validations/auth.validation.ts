import { z } from "zod";
import { createApiResponseSchema } from "./common.validation";

export const userAuthInfoSchema = z.object({
  id: z.string().openapi({ example: "c7b3d8e0-5e0b-4b8f-8e1a-9f0e1d2c3b4a" }),
  email: z.string().email().openapi({ example: "user@example.com" }),
  username: z.string().openapi({ example: "johndoe" }),
  fullName: z.string().nullable().openapi({ example: "John Doe" }),
  bio: z.string().nullable().openapi({ example: "Building great apps" }),
  avatarUrl: z.string().nullable().openapi({ example: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" }),
  website: z.string().nullable().openapi({ example: "https://example.com" }),
  createdAt: z.string().datetime().or(z.date()).openapi({ example: "2026-01-01T00:00:00.000Z" }),
});

export const registerBodySchema = z.object({
  email: z.string().email("Please provide a valid email address").openapi({
    description: "User's email address",
    example: "user@example.com",
  }),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9._]+$/, "Username can only contain letters, numbers, dots, and underscores")
    .openapi({
      description: "Unique username handle",
      example: "johndoe",
    }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .openapi({
      description: "User's secret password",
      example: "SecretPassword123!",
    }),
  fullName: z.string().max(60).optional().openapi({
    description: "Full display name",
    example: "John Doe",
  }),
});

export const loginBodySchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required").openapi({
    description: "User's registered email or username",
    example: "johndoe",
  }),
  password: z.string().min(1, "Password is required").openapi({
    description: "User's password",
    example: "SecretPassword123!",
  }),
});

export const refreshTokenBodySchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required").openapi({
    description: "Valid refresh token string",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  }),
});

export const changePasswordBodySchema = z.object({
  oldPassword: z.string().min(1, "Current password is required").openapi({
    description: "Current account password",
    example: "OldPassword123!",
  }),
  newPassword: z.string().min(6, "New password must be at least 6 characters").openapi({
    description: "New password",
    example: "NewSecretPassword123!",
  }),
});

export const authTokensSchema = z.object({
  accessToken: z.string().openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
  refreshToken: z.string().openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
});

export const authPayloadSchema = z.object({
  user: userAuthInfoSchema,
  accessToken: z.string().openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
  refreshToken: z.string().openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
});

export const authResponseSchema = createApiResponseSchema(authPayloadSchema);
export const refreshTokensResponseSchema = createApiResponseSchema(authTokensSchema);
export const meResponseSchema = createApiResponseSchema(userAuthInfoSchema);
