import { z } from "zod";
import { createApiResponseSchema, createPaginatedResponseSchema, idParamSchema } from "./common.validation";
import { postAuthorSchema } from "./post.validation";

export const createCommentBodySchema = z.object({
  content: z
    .string()
    .min(1, "Comment content cannot be empty")
    .max(500, "Comment cannot exceed 500 characters")
    .openapi({
      description: "Text content of the comment",
      example: "Amazing shot! What camera did you use?",
    }),
});

export const commentParamSchema = idParamSchema.extend({
  commentId: z.string().min(1).openapi({
    description: "Comment ID to delete",
    example: "9b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
  }),
});

export const commentSchema = z.object({
  id: z.string().openapi({ example: "9b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e" }),
  postId: z.string().openapi({ example: "8e2b5b3a-5d0b-4b8f-8e1a-9f0e1d2c3b4a" }),
  content: z.string().openapi({ example: "Amazing shot! What camera did you use?" }),
  user: postAuthorSchema,
  isAuthor: z.boolean().openapi({ example: true }),
  createdAt: z.string().datetime().or(z.date()).openapi({ example: "2026-01-01T13:00:00.000Z" }),
  updatedAt: z.string().datetime().or(z.date()).openapi({ example: "2026-01-01T13:00:00.000Z" }),
});

export const commentResponseSchema = createApiResponseSchema(commentSchema);
export const paginatedCommentsResponseSchema = createPaginatedResponseSchema(commentSchema);
