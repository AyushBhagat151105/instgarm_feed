import prisma from "../lib/prisma";
import {
  formatPaginatedResult,
  getPaginationParams,
  type PaginationQuery,
} from "../utils/pagination";

export class FeedService {
  static async getHomeFeed(userId: string, pagination: PaginationQuery) {
    const { skip, take, page, limit } = getPaginationParams(pagination);

    // 1. Get list of user IDs that current user is following
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);
    // Include user's own posts and posts from accounts they follow
    const authorIds = [...followingIds, userId];

    const where = {
      authorId: { in: authorIds },
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    // Check which posts the current user liked
    let likedPostIds = new Set<string>();
    if (posts.length > 0) {
      const likes = await prisma.like.findMany({
        where: {
          userId,
          postId: { in: posts.map((p) => p.id) },
        },
        select: { postId: true },
      });
      likedPostIds = new Set(likes.map((l) => l.postId));
    }

    const items = posts.map((p) => ({
      id: p.id,
      author: p.author,
      caption: p.caption,
      mediaUrls: p.mediaUrls,
      location: p.location,
      likesCount: p._count.likes,
      commentsCount: p._count.comments,
      isLiked: likedPostIds.has(p.id),
      isAuthor: userId === p.authorId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return formatPaginatedResult(items, total, page, limit);
  }

  static async getExploreFeed(
    pagination: PaginationQuery,
    currentUserId?: string,
  ) {
    const { skip, take, page, limit } = getPaginationParams(pagination);

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      }),
      prisma.post.count(),
    ]);

    let likedPostIds = new Set<string>();
    if (currentUserId && posts.length > 0) {
      const likes = await prisma.like.findMany({
        where: {
          userId: currentUserId,
          postId: { in: posts.map((p) => p.id) },
        },
        select: { postId: true },
      });
      likedPostIds = new Set(likes.map((l) => l.postId));
    }

    const items = posts.map((p) => ({
      id: p.id,
      author: p.author,
      caption: p.caption,
      mediaUrls: p.mediaUrls,
      location: p.location,
      likesCount: p._count.likes,
      commentsCount: p._count.comments,
      isLiked: likedPostIds.has(p.id),
      isAuthor: currentUserId === p.authorId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return formatPaginatedResult(items, total, page, limit);
  }
}
