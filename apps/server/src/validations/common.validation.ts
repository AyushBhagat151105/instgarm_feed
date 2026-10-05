import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).openapi({
    description: "Page number (1-indexed)",
    example: 1,
  }),
  limit: z.coerce.number().int().min(1).max(50).default(10).openapi({
    description: "Number of items per page (max 50)",
    example: 10,
  }),
});

export const idParamSchema = z.object({
  id: z.string().min(1).openapi({
    description: "Resource unique ID",
    example: "c7b3d8e0-5e0b-4b8f-8e1a-9f0e1d2c3b4a",
  }),
});

export const usernameParamSchema = z.object({
  username: z.string().min(3).max(30).openapi({
    description: "User's unique username",
    example: "john_doe",
  }),
});

export const apiErrorResponseSchema = z.object({
  success: z.literal(false).openapi({ example: false }),
  status: z.number().openapi({ example: 400 }),
  error: z.string().openapi({ example: "Error message details" }),
  details: z.unknown().optional(),
});

export function createApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.literal(true).openapi({ example: true }),
    status: z.number().openapi({ example: 200 }),
    data: dataSchema,
    message: z.string().optional().openapi({ example: "Operation successful" }),
  });
}

export function createPaginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    success: z.literal(true).openapi({ example: true }),
    status: z.number().openapi({ example: 200 }),
    data: z.object({
      items: z.array(itemSchema),
      pagination: z.object({
        total: z.number().openapi({ example: 42 }),
        page: z.number().openapi({ example: 1 }),
        limit: z.number().openapi({ example: 10 }),
        totalPages: z.number().openapi({ example: 5 }),
        hasNextPage: z.boolean().openapi({ example: true }),
        hasPrevPage: z.boolean().openapi({ example: false }),
      }),
    }),
  });
}
