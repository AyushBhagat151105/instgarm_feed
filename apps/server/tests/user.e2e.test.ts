import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../src/index";
import "./setup";

describe("User & Profile E2E Tests (/api/v1/users)", () => {
  const userA = {
    email: "usera@example.com",
    username: "usera",
    password: "Password123!",
    fullName: "User Alpha",
  };

  const userB = {
    email: "userb@example.com",
    username: "userb",
    password: "Password123!",
    fullName: "User Beta",
  };

  describe("GET /api/v1/users/:username", () => {
    it("should fetch public user profile with zero initial stats", async () => {
      await request(app).post("/api/v1/auth/register").send(userA);

      const res = await request(app).get(`/api/v1/users/${userA.username}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.username).toBe(userA.username);
      expect(res.body.data.fullName).toBe(userA.fullName);
      expect(res.body.data.postsCount).toBe(0);
      expect(res.body.data.followersCount).toBe(0);
      expect(res.body.data.followingCount).toBe(0);
      expect(res.body.data.isFollowing).toBe(false);
      expect(res.body.data.isSelf).toBe(false);
    });

    it("should correctly identify isSelf when authenticated user views own profile", async () => {
      const reg = await request(app).post("/api/v1/auth/register").send(userA);
      const token = reg.body.data.accessToken;

      const res = await request(app)
        .get(`/api/v1/users/${userA.username}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.isSelf).toBe(true);
    });

    it("should return 404 for unknown username", async () => {
      const res = await request(app).get("/api/v1/users/nonexistentuser");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("PATCH /api/v1/users/profile", () => {
    it("should update user profile details", async () => {
      const reg = await request(app).post("/api/v1/auth/register").send(userA);
      const token = reg.body.data.accessToken;

      const res = await request(app)
        .patch("/api/v1/users/profile")
        .set("Authorization", `Bearer ${token}`)
        .send({
          fullName: "Updated Alpha",
          bio: "Software engineer & photographer",
          website: "https://example.com",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.fullName).toBe("Updated Alpha");
      expect(res.body.data.bio).toBe("Software engineer & photographer");
      expect(res.body.data.website).toBe("https://example.com");
      expect(res.body.data.avatarUrl).toBe("https://images.unsplash.com/photo-1534528741775-53994a69daeb");
    });
  });

  describe("Follow & Unfollow System", () => {
    it("should allow a user to follow and unfollow another user", async () => {
      const regA = await request(app).post("/api/v1/auth/register").send(userA);
      const tokenA = regA.body.data.accessToken;

      await request(app).post("/api/v1/auth/register").send(userB);

      // Follow user B
      const followRes = await request(app)
        .post(`/api/v1/users/${userB.username}/follow`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(followRes.status).toBe(200);
      expect(followRes.body.success).toBe(true);
      expect(followRes.body.data.following).toBe(true);

      // Check User B's profile reflects 1 follower and isFollowing = true
      const profileRes = await request(app)
        .get(`/api/v1/users/${userB.username}`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(profileRes.body.data.followersCount).toBe(1);
      expect(profileRes.body.data.isFollowing).toBe(true);

      // Check User A's followers list for user B
      const followersRes = await request(app).get(`/api/v1/users/${userB.username}/followers`);
      expect(followersRes.status).toBe(200);
      expect(followersRes.body.data.items.length).toBe(1);
      expect(followersRes.body.data.items[0].username).toBe(userA.username);

      // Unfollow user B
      const unfollowRes = await request(app)
        .delete(`/api/v1/users/${userB.username}/follow`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(unfollowRes.status).toBe(200);
      expect(unfollowRes.body.data.following).toBe(false);

      // Verify followers count decremented back to 0
      const profileAfter = await request(app).get(`/api/v1/users/${userB.username}`);
      expect(profileAfter.body.data.followersCount).toBe(0);
    });

    it("should prevent a user from following themselves", async () => {
      const regA = await request(app).post("/api/v1/auth/register").send(userA);
      const tokenA = regA.body.data.accessToken;

      const res = await request(app)
        .post(`/api/v1/users/${userA.username}/follow`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain("cannot follow yourself");
    });
  });

  describe("GET /api/v1/users/search", () => {
    it("should search users by keyword query", async () => {
      await request(app).post("/api/v1/auth/register").send(userA);
      await request(app).post("/api/v1/auth/register").send(userB);

      const res = await request(app).get("/api/v1/users/search?q=alpha");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items.length).toBe(1);
      expect(res.body.data.items[0].username).toBe(userA.username);
    });
  });
});
