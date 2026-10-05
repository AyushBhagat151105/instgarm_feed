import { z } from "zod";
import { createApiResponseSchema, createPaginatedResponseSchema, idParamSchema } from "./common.validation";

export const postAuthorSchema = z.object({
  id: z.string().openapi({ example: "c7b3d8e0-5e0b-4b8f-8e1a-9f0e1d2c3b4a" }),
  username: z.string().openapi({ example: "johndoe" }),
  fullName: z.string().nullable().openapi({ example: "John Doe" }),
  avatarUrl: z.string().nullable().openapi({ example: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" }),
});

export const createPostBodySchema = z.object({
  mediaUrls: z
    .array(z.string().url("Each media item must be a valid URL"))
    .min(1, "Post must have at least one media image or video URL")
    .max(10, "Post cannot have more than 10 media items")
    .openapi({
      description: "Array of image or video URLs for this post",
      example: [
        "https://images.unsplash.com/photo-1517841905240-472988babdf9",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      ],
    }),
  caption: z.string().max(2200, "Caption cannot exceed 2200 characters").optional().openapi({
    description: "Post caption text",
    example: "Golden hour in San Francisco! 🌅✨",
  }),
  location: z.string().max(100).optional().openapi({
    description: "Geographical location or tagged place",
    example: "San Francisco, California",
  }),
});

export const postSchema = z.object({
  id: z.string().openapi({ example: "8e2b5b3a-5d0b-4b8f-8e1a-9f0e1d2c3b4a" }),
  author: postAuthorSchema,
  caption: z.string().nullable().openapi({ example: "Golden hour in San Francisco! 🌅✨" }),
  mediaUrls: z.array(z.string()).openapi({
    example: ["https://images.unsplash.com/photo-1517841905240-472988babdf9"],
  }),
  location: z.string().nullable().openapi({ example: "San Francisco, California" }),
  likesCount: z.number().openapi({ example: 45 }),
  commentsCount: z.number().openapi({ example: 8 }),
  isLiked: z.boolean().openapi({ example: false }),
  isAuthor: z.boolean().openapi({ example: true }),
  createdAt: z.string().datetime().or(z.date()).openapi({ example: "2026-01-01T12:00:00.000Z" }),
  updatedAt: z.string().datetime().or(z.date()).openapi({ example: "2026-01-01T12:00:00.000Z" }),
});

export const postResponseSchema = createApiResponseSchema(postSchema);
export const paginatedPostsResponseSchema = createPaginatedResponseSchema(postSchema);
export const postParamSchema = idParamSchema;
