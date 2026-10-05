import { env } from "@instgarm_feed/env/server";
import cors from "cors";
import express, { type Express } from "express";

import logger from "./lib/logger";
import errorMiddleware from "./middlewares/error.middleware";
import apiRouter from "./routes";
import docsRouter from "./routes/docs.routes";
import { ApiError } from "./utils/api-response";

export const app: Express = express();

// Configure CORS
const allowedOrigins = env.CORS_ORIGIN ? env.CORS_ORIGIN.split(",").map((o) => o.trim()) : ["*"];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new ApiError(403, "Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
    credentials: true,
  }),
);

// Body parsing middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Healthcheck endpoints
app.get(["/", "/health"], (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Instagram Feed & Profile Backend API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Interactive Scalar API Documentation & OpenAPI Specification
app.use("/api/docs", docsRouter);

// Main API routes (routes contain full /api/v1 prefix)
app.use(apiRouter);

// Catch-all 404 handler
app.use((req, _res, next) => {
  next(new ApiError(404, `Endpoint not found: ${req.method} ${req.originalUrl}`));
});

// Global Error Handler
app.use(errorMiddleware);

const port = Number(env.PORT) || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
    logger.info(`Scalar API Reference available at http://localhost:${port}/api/docs`);
    logger.info(`OpenAPI Schema available at http://localhost:${port}/api/docs/openapi.json`);
  });
}

export default app;
