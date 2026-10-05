import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    CORS_ORIGIN: z.string().default("http://localhost:5173"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3000),
    JWT_SECRET: z.string().default("instagram-feed-dev-club-jwt-secret-key-2026"),
    JWT_REFRESH_SECRET: z.string().default("instagram-feed-dev-club-jwt-refresh-secret-key-2026"),
    JWT_EXPIRES_IN: z.string().default("1d"),
    JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
