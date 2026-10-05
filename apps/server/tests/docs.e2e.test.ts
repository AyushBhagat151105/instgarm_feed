import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../src/index";
import { generateOpenApiDocument } from "../src/lib/openapi";

describe("API Documentation & OpenAPI Specifications (Scalar)", () => {
  it("generates a valid OpenAPI 3.0 schema document with all tags and paths", () => {
    const doc = generateOpenApiDocument();

    expect(doc.openapi).toBe("3.0.0");
    expect(doc.info.title).toBe("Instagram Feed & Profile Backend API");
    expect(doc.paths).toBeDefined();

    // Verify all core route groups are documented
    const registeredPaths = Object.keys(doc.paths);
    expect(registeredPaths).toContain("/api/v1/auth/login");
    expect(registeredPaths).toContain("/api/v1/auth/register");
    expect(registeredPaths).toContain("/api/v1/auth/me");
    expect(registeredPaths).toContain("/api/v1/users/{username}");
    expect(registeredPaths).toContain("/api/v1/users/profile");
    expect(registeredPaths).toContain("/api/v1/posts");
    expect(registeredPaths).toContain("/api/v1/posts/{id}");
    expect(registeredPaths).toContain("/api/v1/posts/{id}/like");
    expect(registeredPaths).toContain("/api/v1/posts/{id}/comments");
    expect(registeredPaths).toContain("/api/v1/feed");
    expect(registeredPaths).toContain("/api/v1/feed/explore");
  });

  it("serves OpenAPI specification via GET /api/docs/openapi.json", async () => {
    const res = await request(app).get("/api/docs/openapi.json");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("application/json");
    expect(res.body.openapi).toBe("3.0.0");
    expect(res.body.info.title).toBe("Instagram Feed & Profile Backend API");
    expect(res.body.paths).toHaveProperty("/api/v1/auth/login");
  });

  it("serves the interactive Scalar documentation HTML page via GET /api/docs", async () => {
    const res = await request(app).get("/api/docs");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/html");
    expect(res.text).toContain("Instagram Feed & Profile API Reference");
  });
});
