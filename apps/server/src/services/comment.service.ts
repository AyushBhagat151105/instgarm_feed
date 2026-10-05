import prisma from "../lib/prisma";
import { ApiError } from "../utils/api-response";
import {
  formatPaginatedResult,
  getPaginationParams,
  type PaginationQuery,
} from "../utils/pagination";

export class CommentService {
  static async createComment(userId: string, postId: string, content: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new ApiError(404, "Post not found.");
    }

    const comment = await prisma.comment.create({
      data: {
        userId,
        postId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return {
      id: comment.id,
      postId: comment.postId,
      content: comment.content,
      user: comment.user,
      isAuthor: true,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  static async getPostComments(
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

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { postId },
        skip,
        take,
        orderBy: { createdAt: "asc" },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
      }),
      prisma.comment.count({ where: { postId } }),
    ]);

    const items = comments.map((c) => ({
      id: c.id,
      postId: c.postId,
      content: c.content,
      user: c.user,
      isAuthor: currentUserId === c.userId,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return formatPaginatedResult(items, total, page, limit);
  }

  static async deleteComment(
    userId: string,
    postId: string,
    commentId: string,
  ) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { post: true },
    });

    if (!comment || comment.postId !== postId) {
      throw new ApiError(404, "Comment not found.");
    }

    // Allowed to delete if user is comment author OR post author
    if (comment.userId !== userId && comment.post.authorId !== userId) {
      throw new ApiError(403, "You do not have permission to delete this comment.");
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });
  }
}
