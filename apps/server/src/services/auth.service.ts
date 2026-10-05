import prisma from "../lib/prisma";
import { ApiError } from "../utils/api-response";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";

export class AuthService {
  static async register(data: {
    email: string;
    username: string;
    password: string;
    fullName?: string;
  }) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email.toLowerCase() },
          { username: data.username.toLowerCase() },
        ],
      },
    });

    if (existing) {
      if (existing.email.toLowerCase() === data.email.toLowerCase()) {
        throw new ApiError(409, "A user with this email already exists.");
      }
      throw new ApiError(409, "A user with this username already exists.");
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        username: data.username.toLowerCase(),
        passwordHash,
        fullName: data.fullName || null,
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        bio: true,
        avatarUrl: true,
        website: true,
        createdAt: true,
      },
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    // Store refresh token in database (valid for 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  static async login(data: { emailOrUsername: string; password: string }) {
    const identifier = data.emailOrUsername.toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      throw new ApiError(401, "Invalid email/username or password.");
    }

    const isMatch = await comparePassword(data.password, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(401, "Invalid email/username or password.");
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    const { passwordHash: _, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }

  static async refresh(refreshTokenStr: string) {
    const payload = verifyRefreshToken(refreshTokenStr);
    if (!payload) {
      throw new ApiError(401, "Invalid or expired refresh token.");
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshTokenStr },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      if (storedToken) {
        await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      }
      throw new ApiError(401, "Refresh token has expired or been revoked.");
    }

    // Revoke old token
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    // Issue new pair
    const accessToken = generateAccessToken({
      userId: storedToken.user.id,
      email: storedToken.user.email,
      username: storedToken.user.username,
    });

    const newRefreshToken = generateRefreshToken({
      userId: storedToken.user.id,
      email: storedToken.user.email,
      username: storedToken.user.username,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: storedToken.user.id,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  static async logout(refreshTokenStr: string) {
    try {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshTokenStr },
      });
    } catch {
      // Idempotent logout
    }
  }

  static async changePassword(
    userId: string,
    data: { oldPassword: string; newPassword: string },
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const isMatch = await comparePassword(data.oldPassword, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(400, "Current password is incorrect.");
    }

    const passwordHash = await hashPassword(data.newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Revoke all existing sessions upon password change
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        bio: true,
        avatarUrl: true,
        website: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return user;
  }
}
