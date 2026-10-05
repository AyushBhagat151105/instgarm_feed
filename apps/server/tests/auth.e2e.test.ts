import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../src/index";
import "./setup";

describe("Auth E2E Tests (/api/v1/auth)", () => {
  const testUser = {
    email: "testuser@example.com",
    username: "testuser",
    password: "Password123!",
    fullName: "Test User",
  };

  describe("POST /api/v1/auth/register", () => {
    it("should successfully register a new user and return tokens", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("user");
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.user.username).toBe(testUser.username);
      expect(res.body.data.user).not.toHaveProperty("passwordHash");
      expect(res.body.data).toHaveProperty("accessToken");
      expect(res.body.data).toHaveProperty("refreshToken");
    });

    it("should reject registration with invalid email", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          ...testUser,
          email: "invalid-email",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain("Validation error");
    });

    it("should reject registration with weak password (under 8 chars)", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          ...testUser,
          password: "123",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should reject duplicate email or username with 409 conflict", async () => {
      await request(app).post("/api/v1/auth/register").send(testUser);

      const duplicateEmailRes = await request(app)
        .post("/api/v1/auth/register")
        .send({ ...testUser, username: "differentuser" });

      expect(duplicateEmailRes.status).toBe(409);
      expect(duplicateEmailRes.body.error).toContain("Email");

      const duplicateUsernameRes = await request(app)
        .post("/api/v1/auth/register")
        .send({ ...testUser, email: "different@example.com" });

      expect(duplicateUsernameRes.status).toBe(409);
      expect(duplicateUsernameRes.body.error).toContain("Username");
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should successfully log in with email and return tokens", async () => {
      await request(app).post("/api/v1/auth/register").send(testUser);

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          emailOrUsername: testUser.email,
          password: testUser.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.accessToken).toBeDefined();
    });

    it("should successfully log in with username and return tokens", async () => {
      await request(app).post("/api/v1/auth/register").send(testUser);

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          emailOrUsername: testUser.username,
          password: testUser.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.username).toBe(testUser.username);
    });

    it("should reject login with wrong password", async () => {
      await request(app).post("/api/v1/auth/register").send(testUser);

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          emailOrUsername: testUser.email,
          password: "WrongPassword999!",
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain("Invalid email/username or password");
    });
  });

  describe("GET /api/v1/auth/me", () => {
    it("should return the current user profile when bearer token is provided", async () => {
      const reg = await request(app).post("/api/v1/auth/register").send(testUser);
      const token = reg.body.data.accessToken;

      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testUser.email);
      expect(res.body.data.username).toBe(testUser.username);
    });

    it("should return 401 when token is missing", async () => {
      const res = await request(app).get("/api/v1/auth/me");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/auth/refresh", () => {
    it("should refresh tokens using a valid refresh token", async () => {
      const reg = await request(app).post("/api/v1/auth/register").send(testUser);
      const refreshToken = reg.body.data.refreshToken;

      const res = await request(app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
    });

    it("should return 401 for an invalid refresh token", async () => {
      const res = await request(app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: "invalid-or-revoked-token" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/auth/logout", () => {
    it("should revoke refresh token on logout", async () => {
      const reg = await request(app).post("/api/v1/auth/register").send(testUser);
      const { accessToken, refreshToken } = reg.body.data;

      const logoutRes = await request(app)
        .post("/api/v1/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ refreshToken });

      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.success).toBe(true);

      // Subsequent refresh attempt with revoked token should fail
      const refreshRes = await request(app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken });

      expect(refreshRes.status).toBe(401);
    });
  });

  describe("PATCH /api/v1/auth/password", () => {
    it("should update password when current password is valid", async () => {
      const reg = await request(app).post("/api/v1/auth/register").send(testUser);
      const token = reg.body.data.accessToken;

      const res = await request(app)
        .patch("/api/v1/auth/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: testUser.password,
          newPassword: "BrandNewPassword456!",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify login with new password
      const loginRes = await request(app)
        .post("/api/v1/auth/login")
        .send({
          emailOrUsername: testUser.username,
          password: "BrandNewPassword456!",
        });

      expect(loginRes.status).toBe(200);
    });
  });
});
