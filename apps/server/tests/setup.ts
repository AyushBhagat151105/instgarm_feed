import { beforeEach } from "vitest";

import prisma from "../src/lib/prisma";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-super-secret-jwt-key-32-chars-length-min";
process.env.JWT_REFRESH_SECRET = "test-super-secret-jwt-refresh-key-32-chars";
process.env.JWT_EXPIRES_IN = "1h";
process.env.JWT_REFRESH_EXPIRES_IN = "7d";
process.env.CORS_ORIGIN = "*";

export async function clearDatabase() {
  try {
    await prisma.comment.deleteMany();
    await prisma.like.deleteMany();
    await prisma.post.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
  } catch (err) {
    // If DB is not connected in standalone unit test environments, catch gracefully
  }
}

beforeEach(async () => {
  await clearDatabase();
});
