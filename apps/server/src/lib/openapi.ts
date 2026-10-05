import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

// Extend Zod to support .openapi(...) metadata chaining
extendZodWithOpenApi(z);

export const openApiRegistry = new OpenAPIRegistry();

// Register the standard Bearer Auth security scheme for JWT
export const bearerAuth = openApiRegistry.registerComponent(
  "securitySchemes",
  "bearerAuth",
  {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Enter your Bearer JWT token to authenticate",
  },
);

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(openApiRegistry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Instagram Feed & Profile Backend API",
      description:
        "Full-featured Instagram Feed and Profiles clone backend API with Auth, Follows, Posts, Likes, Comments, and Home/Explore Feeds. Built for the developer club challenge.",
    },
    servers: [
      {
        url: "/",
        description: "Current Server Base",
      },
    ],
  });
}
