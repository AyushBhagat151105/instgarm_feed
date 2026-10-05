import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../src/index";
import "./setup";

describe("Post E2E Tests (/api/v1/posts)", () => {
  const userA = {
    email: "author@example.com",
    username: "author",
    password: "Password123!",
    fullName: "Post Author",
  };

  const userB = {
    email: "stranger@example.com",
    username: "stranger",
    password: "Password123!",
    fullName: "Stranger",
  };

  describe("POST /api/v1/posts", () => {
    it("should successfully create a new post with multiple media URLs", async () => {
      const reg = await request(app).post("/api/v1/auth/register").send(userA);
      const token = reg.body.data.accessToken;

      const postData = {
        mediaUrls: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
          "https://images.unsplash.com/photo-1519046904884-53103b34b206",
        ],
        caption: "Sunset at the beach #vacation",
        location: "Bali, Indonesia",
      };

      const res = await request(app)
        .post("/api/v1/posts")
        .set("Authorization", `Bearer ${token}`)
        .send(postData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.caption).toBe(postData.caption);
      expect(res.body.data.location).toBe(postData.location);
      expect(res.body.data.mediaUrls).toEqual(postData.mediaUrls);
      expect(res.body.data.author.username).toBe(userA.username);
      expect(res.body.data.likesCount).toBe(0);
      expect(res.body.data.commentsCount).toBe(0);
      expect(res.body.data.isAuthor).toBe(true);
    });

    it("should reject post creation with empty mediaUrls", async () => {
      const reg = await request(app).post("/api/v1/auth/register").send(userA);
      const token = reg.body.data.accessToken;

      const res = await request(app)
        .post("/api/v1/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          mediaUrls: [],
          caption: "No photos here",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/posts/:id", () => {
    it("should retrieve a post by its ID", async () => {
      const reg = await request(app).post("/api/v1/auth/register").send(userA);
      const token = reg.body.data.accessToken;

      const postRes = await request(app)
        .post("/api/v1/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          mediaUrls: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e"],
          caption: "Beautiful day!",
        });

      const postId = postRes.body.data.id;

      const res = await request(app).get(`/api/v1/posts/${postId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(postId);
      expect(res.body.data.caption).toBe("Beautiful day!");
    });
  });

  describe("DELETE /api/v1/posts/:id", () => {
    it("should allow the post author to delete the post", async () => {
      const reg = await request(app).post("/api/v1/auth/register").send(userA);
      const token = reg.body.data.accessToken;

      const postRes = await request(app)
        .post("/api/v1/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          mediaUrls: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e"],
          caption: "To be deleted",
        });

      const postId = postRes.body.data.id;

      const deleteRes = await request(app)
        .delete(`/api/v1/posts/${postId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.success).toBe(true);

      const getRes = await request(app).get(`/api/v1/posts/${postId}`);
      expect(getRes.status).toBe(404);
    });

    it("should forbid another user from deleting the post", async () => {
      const regA = await request(app).post("/api/v1/auth/register").send(userA);
      const tokenA = regA.body.data.accessToken;

      const regB = await request(app).post("/api/v1/auth/register").send(userB);
      const tokenB = regB.body.data.accessToken;

      const postRes = await request(app)
        .post("/api/v1/posts")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          mediaUrls: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e"],
          caption: "Private post",
        });

      const postId = postRes.body.data.id;

      const deleteRes = await request(app)
        .delete(`/api/v1/posts/${postId}`)
        .set("Authorization", `Bearer ${tokenB}`);

      expect(deleteRes.status).toBe(403);
      expect(deleteRes.body.success).toBe(false);
      expect(deleteRes.body.error).toContain("You can only delete your own posts");
    });
  });

  describe("GET /api/v1/users/:username/posts", () => {
    it("should list all posts created by a specific user", async () => {
      const reg = await request(app).post("/api/v1/auth/register").send(userA);
      const token = reg.body.data.accessToken;

      await request(app)
        .post("/api/v1/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          mediaUrls: ["https://images.unsplash.com/photo-1507525428034-1"],
          caption: "First post",
        });

      await request(app)
        .post("/api/v1/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          mediaUrls: ["https://images.unsplash.com/photo-1507525428034-2"],
          caption: "Second post",
        });

      const res = await request(app).get(`/api/v1/users/${userA.username}/posts`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items.length).toBe(2);
      expect(res.body.data.pagination.total).toBe(2);
    });
  });
});
