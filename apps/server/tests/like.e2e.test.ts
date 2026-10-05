import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../src/index";
import "./setup";

describe("Like E2E Tests (/api/v1/posts/:id/like)", () => {
  const author = {
    email: "author@like.com",
    username: "like_author",
    password: "Password123!",
    fullName: "Author",
  };

  const liker = {
    email: "liker@like.com",
    username: "like_fan",
    password: "Password123!",
    fullName: "Liker Fan",
  };

  describe("Like & Unlike Flows", () => {
    it("should like, check likes list, and unlike a post", async () => {
      const regAuthor = await request(app).post("/api/v1/auth/register").send(author);
      const tokenAuthor = regAuthor.body.data.accessToken;

      const regLiker = await request(app).post("/api/v1/auth/register").send(liker);
      const tokenLiker = regLiker.body.data.accessToken;

      // Create post
      const postRes = await request(app)
        .post("/api/v1/posts")
        .set("Authorization", `Bearer ${tokenAuthor}`)
        .send({
          mediaUrls: ["https://example.com/liked-image.jpg"],
          caption: "Give this a like!",
        });

      const postId = postRes.body.data.id;

      // 1. Like the post
      const likeRes = await request(app)
        .post(`/api/v1/posts/${postId}/like`)
        .set("Authorization", `Bearer ${tokenLiker}`);

      expect(likeRes.status).toBe(200);
      expect(likeRes.body.success).toBe(true);
      expect(likeRes.body.data.liked).toBe(true);
      expect(likeRes.body.data.likesCount).toBe(1);

      // 2. Fetch post details to verify isLiked = true and likesCount = 1
      const postDetailsRes = await request(app)
        .get(`/api/v1/posts/${postId}`)
        .set("Authorization", `Bearer ${tokenLiker}`);

      expect(postDetailsRes.body.data.likesCount).toBe(1);
      expect(postDetailsRes.body.data.isLiked).toBe(true);

      // 3. Fetch list of likes for this post
      const likesListRes = await request(app).get(`/api/v1/posts/${postId}/likes`);
      expect(likesListRes.status).toBe(200);
      expect(likesListRes.body.data.items.length).toBe(1);
      expect(likesListRes.body.data.items[0].username).toBe(liker.username);

      // 4. Unlike the post
      const unlikeRes = await request(app)
        .delete(`/api/v1/posts/${postId}/like`)
        .set("Authorization", `Bearer ${tokenLiker}`);

      expect(unlikeRes.status).toBe(200);
      expect(unlikeRes.body.data.liked).toBe(false);
      expect(unlikeRes.body.data.likesCount).toBe(0);

      // 5. Verify post details after unlike
      const postAfterUnlike = await request(app)
        .get(`/api/v1/posts/${postId}`)
        .set("Authorization", `Bearer ${tokenLiker}`);

      expect(postAfterUnlike.body.data.likesCount).toBe(0);
      expect(postAfterUnlike.body.data.isLiked).toBe(false);
    });
  });
});
