import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../src/index";
import "./setup";

describe("Comment E2E Tests (/api/v1/posts/:id/comments)", () => {
  const postAuthor = {
    email: "postauthor@comment.com",
    username: "post_author",
    password: "Password123!",
    fullName: "Post Author",
  };

  const commenter = {
    email: "commenter@comment.com",
    username: "commenter_user",
    password: "Password123!",
    fullName: "Commenter",
  };

  const bystander = {
    email: "bystander@comment.com",
    username: "bystander_user",
    password: "Password123!",
    fullName: "Bystander",
  };

  describe("Create, List, and Delete Comments", () => {
    it("should allow creating, listing, and deleting comments with proper permission checks", async () => {
      const regAuthor = await request(app).post("/api/v1/auth/register").send(postAuthor);
      const tokenAuthor = regAuthor.body.data.accessToken;

      const regCommenter = await request(app).post("/api/v1/auth/register").send(commenter);
      const tokenCommenter = regCommenter.body.data.accessToken;

      const regBystander = await request(app).post("/api/v1/auth/register").send(bystander);
      const tokenBystander = regBystander.body.data.accessToken;

      // 1. Create a post
      const postRes = await request(app)
        .post("/api/v1/posts")
        .set("Authorization", `Bearer ${tokenAuthor}`)
        .send({
          mediaUrls: ["https://example.com/comment-test.jpg"],
          caption: "Comment below!",
        });

      const postId = postRes.body.data.id;

      // 2. Add comment
      const commentRes = await request(app)
        .post(`/api/v1/posts/${postId}/comments`)
        .set("Authorization", `Bearer ${tokenCommenter}`)
        .send({
          content: "Awesome shot! 🔥",
        });

      expect(commentRes.status).toBe(201);
      expect(commentRes.body.success).toBe(true);
      expect(commentRes.body.data.content).toBe("Awesome shot! 🔥");
      expect(commentRes.body.data.user.username).toBe(commenter.username);

      const commentId = commentRes.body.data.id;

      // 3. List comments
      const listRes = await request(app).get(`/api/v1/posts/${postId}/comments`);
      expect(listRes.status).toBe(200);
      expect(listRes.body.data.items.length).toBe(1);
      expect(listRes.body.data.items[0].content).toBe("Awesome shot! 🔥");

      // 4. Check bystander is rejected when trying to delete the comment
      const unauthorizedDeleteRes = await request(app)
        .delete(`/api/v1/posts/${postId}/comments/${commentId}`)
        .set("Authorization", `Bearer ${tokenBystander}`);

      expect(unauthorizedDeleteRes.status).toBe(403);
      expect(unauthorizedDeleteRes.body.success).toBe(false);

      // 5. Post author (or comment author) can delete the comment
      const authorDeleteRes = await request(app)
        .delete(`/api/v1/posts/${postId}/comments/${commentId}`)
        .set("Authorization", `Bearer ${tokenAuthor}`);

      expect(authorDeleteRes.status).toBe(200);
      expect(authorDeleteRes.body.success).toBe(true);

      // 6. Verify comments list is now empty
      const listAfterDelete = await request(app).get(`/api/v1/posts/${postId}/comments`);
      expect(listAfterDelete.body.data.items.length).toBe(0);
    });
  });
});
