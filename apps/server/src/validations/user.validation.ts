import { z } from "zod";
import { createApiResponseSchema, createPaginatedResponseSchema, paginationQuerySchema } from "./common.validation";

export const updateProfileBodySchema = z.object({
  fullName: z.string().max(60).nullable().optional().openapi({
    description: "Display full name",
    example: "John Doe",
  }),
  bio: z.string().max(300).nullable().optional().openapi({
    description: "User biography / description (max 300 characters)",
    example: "Developer & Creator 📸",
  }),
  avatarUrl: z.string().url("Must be a valid URL").nullable().optional().openapi({
    description: "Public avatar image URL",
    example: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
  }),
  website: z.string().url("Must be a valid URL").nullable().optional().openapi({
    description: "Personal website link",
    example: "https://github.com",
  }),
});

export const searchUsersQuerySchema = paginationQuerySchema.extend({
  q: z.string().min(1, "Search term must be at least 1 character").openapi({
    description: "Search keyword matching username or full name",
    example: "john",
  }),
});

export const userSummarySchema = z.object({
  id: z.string().openapi({ example: "c7b3d8e0-5e0b-4b8f-8e1a-9f0e1d2c3b4a" }),
  username: z.string().openapi({ example: "johndoe" }),
  fullName: z.string().nullable().openapi({ example: "John Doe" }),
  avatarUrl: z.string().nullable().openapi({ example: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" }),
  bio: z.string().nullable().openapi({ example: "Developer" }),
  isFollowing: z.boolean().optional().openapi({ example: false }),
  isSelf: z.boolean().optional().openapi({ example: false }),
});

export const userProfileSchema = z.object({
  id: z.string().openapi({ example: "c7b3d8e0-5e0b-4b8f-8e1a-9f0e1d2c3b4a" }),
  email: z.string().email().optional().openapi({ example: "user@example.com" }),
  username: z.string().openapi({ example: "johndoe" }),
  fullName: z.string().nullable().openapi({ example: "John Doe" }),
  bio: z.string().nullable().openapi({ example: "Passionate photographer and developer" }),
  avatarUrl: z.string().nullable().openapi({ example: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" }),
  website: z.string().nullable().openapi({ example: "https://myblog.com" }),
  createdAt: z.string().datetime().or(z.date()).openapi({ example: "2026-01-01T00:00:00.000Z" }),
  postsCount: z.number().openapi({ example: 12 }),
  followersCount: z.number().openapi({ example: 340 }),
  followingCount: z.number().openapi({ example: 180 }),
  isFollowing: z.boolean().openapi({ example: false }),
  isSelf: z.boolean().openapi({ example: true }),
});

export const followActionResponseSchema = createApiResponseSchema(
  z.object({
    following: z.boolean().openapi({ example: true }),
    followersCount: z.number().openapi({ example: 341 }),
  }),
);

export const userProfileResponseSchema = createApiResponseSchema(userProfileSchema);
export const userListResponseSchema = createPaginatedResponseSchema(userSummarySchema);
