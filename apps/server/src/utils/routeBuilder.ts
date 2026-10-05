import type { RequestHandler, Router } from "express";
import type { ZodType } from "zod";

import { openApiRegistry } from "../lib/openapi";
import { validateRequest } from "../middlewares/validate.middleware";

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

export interface RouteResponse {
  description: string;
  schema?: ZodType<any>;
}

export interface RouteConfig {
  method: HttpMethod;
  path: string;
  summary: string;
  description?: string;
  tags: string[];
  security?: "bearer" | "none";
  request?: {
    body?: ZodType<any>;
    query?: ZodType<any>;
    params?: ZodType<any>;
    headers?: ZodType<any>;
  };
  responses: Record<string | number, RouteResponse>;
}

export function registerRoute(
  router: Router,
  config: RouteConfig,
  ...handlers: RequestHandler[]
): void {
  // 1. Convert responses to OpenAPI format
  const openApiResponses: Record<string, any> = {};

  for (const [status, res] of Object.entries(config.responses)) {
    openApiResponses[String(status)] = {
      description: res.description,
      ...(res.schema
        ? {
            content: {
              "application/json": {
                schema: res.schema,
              },
            },
          }
        : {}),
    };
  }

  // 2. Register path with OpenAPI registry
  openApiRegistry.registerPath({
    method: config.method,
    path: config.path,
    summary: config.summary,
    description: config.description,
    tags: config.tags,
    security: config.security === "bearer" ? [{ bearerAuth: [] }] : undefined,
    request: {
      body: config.request?.body
        ? {
            content: {
              "application/json": {
                schema: config.request.body,
              },
            },
          }
        : undefined,
      query: config.request?.query,
      params: config.request?.params,
      headers: config.request?.headers,
    },
    responses: openApiResponses,
  });

  // 3. Mount on Express router with auto-validation middleware
  const routeHandlers: RequestHandler[] = [];

  if (
    config.request?.body ||
    config.request?.query ||
    config.request?.params ||
    config.request?.headers
  ) {
    routeHandlers.push(
      validateRequest({
        body: config.request.body,
        query: config.request.query,
        params: config.request.params,
        headers: config.request.headers,
      }),
    );
  }

  routeHandlers.push(...handlers);

  // Map Express router path
  // Since router might be mounted at /api/v1, if config.path starts with /api/v1, we mount the suffix or full path
  // If the router is mounted at root, path is config.path
  router[config.method](config.path, ...routeHandlers);
}
