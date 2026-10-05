import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../src/index";
import "./setup";

describe("Feed E2E Tests (/api/v1/feed)", () => {
  const userA = {
    email: "usera@feed.com",
    username: "feed_usera",
    password: "Password123!",
    fullName: "User A",
  };

  const userB = {
    email: "userb@feed.com",
    username: "feed_userb",
    password: "Password123!",
    fullName: "User B",
  };

  const userC = {
    email: "userc@feed.com",
    username: "feed_userc",
    password: "Password123!",
    fullName: "User C (Stranger)",
  };

  describe("GET /api/v1/feed (Home Feed)", () => {
    it("should return posts only from followed users and current user", async () => {
      // Register all 3 users
      const regA = await request(app).post("/api/v1/auth/register").send(userA);
      const tokenA = regA.body.data.accessToken;

      const regB = await request(app).post("/api/v1/auth/register").send(userB);
      const tokenB = regB.body.data.accessToken;

      const regC = await request(app).post("/api/v1/auth/register").send(userC);
      const tokenC = regC.body.data.accessToken;

      // User A follows User B (User A does NOT follow User C)
      await request(app)
        .post(`/api/v1/users/${userB.username}/follow`)
        .set("Authorization", `Bearer ${tokenA}`);

      // User A creates post 1
      await request(app)
        .post("/api/v1/posts")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          mediaUrls: ["https://example.com/postA.jpg"],
          caption: "Post from User A",
        });

      // User B creates post 2
      await request(app)
        .post("/api/v1/posts")
        .set("Authorization", `Bearer ${tokenB}`)
        .send({
          mediaUrls: ["https://example.com/postB.jpg"],
          caption: "Post from User B",
        });

      // User C creates post 3
      await request(app)
        .post("/api/v1/posts")
        .set("Authorization", `Bearer ${tokenC}`)
        .send({
          mediaUrls: ["https://example.com/postC.jpg"],
          caption: "Post from User C",
        });

      // User A requests home feed
      const feedRes = await request(app)
        .get("/api/v1/feed")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(feedRes.status).toBe(200);
      expect(feedRes.body.success).toBe(true);
      expect(feedRes.body.data.items.length).toBe(2);

      const authors = feedRes.body.data.items.map((p: any) => p.author.username);
      expect(authors).toContain(userA.username);
      expect(authors).toContain(userB.username);
      expect(authors).not.toContain(userC.username);
    });
  });

  describe("GET /api/v1/feed/explore (Explore Feed)", () => {
    it("should return posts across all accounts for discovery", async () => {
      const regA = await request(app).post("/api/v1/auth/register").send(userA);
      const tokenA = regA.body.data.accessToken;

      const regB = await request(app).post("/api/v1/auth/register").send(userB);
      const tokenB = regB.body.data.accessToken;

      // Create posts
      await request(app)
        .post("/api/v1/posts")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          mediaUrls: ["https://example.com/explore1.jpg"],
          caption: "Explore post 1",
        });

      await request(app)
        .post("/api/v1/posts")
        .set("Authorization", `Bearer ${tokenB}`)
        .send({
          mediaUrls: ["https://example.com/explore2.jpg"],
          caption: "Explore post 2",
        });

      // Guest / unauthenticated request to explore feed
      const exploreRes = await request(app).get("/api/v1/feed/explore");

      expect(exploreRes.status).toBe(200);
      expect(exploreRes.body.success).toBe(true);
      expect(exploreRes.body.data.items.length).toBe(2);
    });
  });
});
