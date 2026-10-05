import { paginationQuerySchema } from "./common.validation";
import { paginatedPostsResponseSchema } from "./post.validation";

export const feedQuerySchema = paginationQuerySchema;
export const feedResponseSchema = paginatedPostsResponseSchema;
