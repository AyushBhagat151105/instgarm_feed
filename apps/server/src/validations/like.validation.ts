import { z } from "zod";
import { createApiResponseSchema, createPaginatedResponseSchema, idParamSchema } from "./common.validation";
import { userSummarySchema } from "./user.validation";

export const likeParamSchema = idParamSchema;

export const likeToggleResponseSchema = createApiResponseSchema(
  z.object({
    liked: z.boolean().openapi({ example: true }),
    likesCount: z.number().openapi({ example: 46 }),
  }),
);

export const likeListResponseSchema = createPaginatedResponseSchema(userSummarySchema);
