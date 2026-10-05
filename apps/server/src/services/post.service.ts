import prisma from "../lib/prisma";
import { ApiError } from "../utils/api-response";
import {
  formatPaginatedResult,
  getPaginationParams,
  type PaginationQuery,
} from "../utils/pagination";

export class PostService {
  static async createPost(
    authorId: string,
    data: {
      mediaUrls: string[];
      caption?: string;
      location?: string;
    },
  ) {
    const post = await prisma.post.create({
      data: {
        authorId,
        mediaUrls: data.mediaUrls,
        caption: data.caption || null,
        location: data.location || null,
      },
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
    });

    return {
      id: post.id,
      author: post.author,
      caption: post.caption,
      mediaUrls: post.mediaUrls,
      location: post.location,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      isLiked: false,
      isAuthor: true,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  static async getPostById(postId: string, currentUserId?: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
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
    });

    if (!post) {
      throw new ApiError(404, "Post not found.");
    }

    let isLiked = false;
    if (currentUserId) {
      const like = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: currentUserId,
            postId: post.id,
          },
        },
      });
      isLiked = Boolean(like);
    }

    return {
      id: post.id,
      author: post.author,
      caption: post.caption,
      mediaUrls: post.mediaUrls,
      location: post.location,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      isLiked,
      isAuthor: currentUserId === post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  static async deletePost(authorId: string, postId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new ApiError(404, "Post not found.");
    }

    if (post.authorId !== authorId) {
      throw new ApiError(403, "You can only delete your own posts.");
    }

    await prisma.post.delete({
      where: { id: postId },
    });
  }

  static async getUserPosts(
    username: string,
    pagination: PaginationQuery,
    currentUserId?: string,
  ) {
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    });

    if (!user) {
      throw new ApiError(404, `User @${username} not found.`);
    }

    const { skip, take, page, limit } = getPaginationParams(pagination);

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { authorId: user.id },
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
      prisma.post.count({ where: { authorId: user.id } }),
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
