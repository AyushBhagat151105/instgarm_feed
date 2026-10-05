import prisma from "../lib/prisma";
import { ApiError } from "../utils/api-response";
import {
  formatPaginatedResult,
  getPaginationParams,
  type PaginationQuery,
} from "../utils/pagination";

export class LikeService {
  static async likePost(userId: string, postId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new ApiError(404, "Post not found.");
    }

    await prisma.like.upsert({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      create: {
        userId,
        postId,
      },
      update: {},
    });

    const likesCount = await prisma.like.count({
      where: { postId },
    });

    return {
      liked: true,
      likesCount,
    };
  }

  static async unlikePost(userId: string, postId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new ApiError(404, "Post not found.");
    }

    await prisma.like.deleteMany({
      where: {
        userId,
        postId,
      },
    });

    const likesCount = await prisma.like.count({
      where: { postId },
    });

    return {
      liked: false,
      likesCount,
    };
  }

  static async getPostLikes(
    postId: string,
    pagination: PaginationQuery,
    currentUserId?: string,
  ) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new ApiError(404, "Post not found.");
    }

    const { skip, take, page, limit } = getPaginationParams(pagination);

    const [likes, total] = await Promise.all([
      prisma.like.findMany({
        where: { postId },
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatarUrl: true,
              bio: true,
            },
          },
        },
      }),
      prisma.like.count({ where: { postId } }),
    ]);

    const users = likes.map((l) => l.user);

    let followedUserIds = new Set<string>();
    if (currentUserId && users.length > 0) {
      const follows = await prisma.follow.findMany({
        where: {
          followerId: currentUserId,
          followingId: { in: users.map((u) => u.id) },
        },
        select: { followingId: true },
      });
      followedUserIds = new Set(follows.map((f) => f.followingId));
    }

    const items = users.map((u) => ({
      ...u,
      isFollowing: followedUserIds.has(u.id),
      isSelf: currentUserId === u.id,
    }));

    return formatPaginatedResult(items, total, page, limit);
  }
}
