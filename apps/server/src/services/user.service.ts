import prisma from "../lib/prisma";
import { ApiError } from "../utils/api-response";
import {
  formatPaginatedResult,
  getPaginationParams,
  type PaginationQuery,
} from "../utils/pagination";

export class UserService {
  static async getProfileByUsername(username: string, currentUserId?: string) {
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      include: {
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      throw new ApiError(404, `User @${username} not found.`);
    }

    let isFollowing = false;
    if (currentUserId && currentUserId !== user.id) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: user.id,
          },
        },
      });
      isFollowing = Boolean(follow);
    }

    return {
      id: user.id,
      email: currentUserId === user.id ? user.email : undefined,
      username: user.username,
      fullName: user.fullName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      website: user.website,
      createdAt: user.createdAt,
      postsCount: user._count.posts,
      followersCount: user._count.followers,
      followingCount: user._count.following,
      isFollowing,
      isSelf: currentUserId === user.id,
    };
  }

  static async updateProfile(
    userId: string,
    data: {
      fullName?: string | null;
      bio?: string | null;
      avatarUrl?: string | null;
      website?: string | null;
    },
  ) {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.fullName !== undefined ? { fullName: data.fullName } : {}),
        ...(data.bio !== undefined ? { bio: data.bio } : {}),
        ...(data.avatarUrl !== undefined ? { avatarUrl: data.avatarUrl } : {}),
        ...(data.website !== undefined ? { website: data.website } : {}),
      },
      include: {
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    return {
      id: updated.id,
      email: updated.email,
      username: updated.username,
      fullName: updated.fullName,
      bio: updated.bio,
      avatarUrl: updated.avatarUrl,
      website: updated.website,
      createdAt: updated.createdAt,
      postsCount: updated._count.posts,
      followersCount: updated._count.followers,
      followingCount: updated._count.following,
      isFollowing: false,
      isSelf: true,
    };
  }

  static async searchUsers(
    query: string,
    pagination: PaginationQuery,
    currentUserId?: string,
  ) {
    const { skip, take, page, limit } = getPaginationParams(pagination);
    const searchTerm = query.trim().toLowerCase();

    const where = {
      OR: [
        { username: { contains: searchTerm, mode: "insensitive" as const } },
        { fullName: { contains: searchTerm, mode: "insensitive" as const } },
      ],
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { username: "asc" },
        select: {
          id: true,
          username: true,
          fullName: true,
          avatarUrl: true,
          bio: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    // Check which users current user follows
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

  static async followUser(followerId: string, targetUsername: string) {
    const targetUser = await prisma.user.findUnique({
      where: { username: targetUsername.toLowerCase() },
    });

    if (!targetUser) {
      throw new ApiError(404, `User @${targetUsername} not found.`);
    }

    if (targetUser.id === followerId) {
      throw new ApiError(400, "You cannot follow yourself.");
    }

    await prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId,
          followingId: targetUser.id,
        },
      },
      create: {
        followerId,
        followingId: targetUser.id,
      },
      update: {},
    });

    const followersCount = await prisma.follow.count({
      where: { followingId: targetUser.id },
    });

    return {
      following: true,
      followersCount,
    };
  }

  static async unfollowUser(followerId: string, targetUsername: string) {
    const targetUser = await prisma.user.findUnique({
      where: { username: targetUsername.toLowerCase() },
    });

    if (!targetUser) {
      throw new ApiError(404, `User @${targetUsername} not found.`);
    }

    await prisma.follow.deleteMany({
      where: {
        followerId,
        followingId: targetUser.id,
      },
    });

    const followersCount = await prisma.follow.count({
      where: { followingId: targetUser.id },
    });

    return {
      following: false,
      followersCount,
    };
  }

  static async getFollowers(
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

    const [follows, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followingId: user.id },
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          follower: {
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
      prisma.follow.count({ where: { followingId: user.id } }),
    ]);

    const followerUsers = follows.map((f) => f.follower);

    let followedUserIds = new Set<string>();
    if (currentUserId && followerUsers.length > 0) {
      const myFollows = await prisma.follow.findMany({
        where: {
          followerId: currentUserId,
          followingId: { in: followerUsers.map((u) => u.id) },
        },
        select: { followingId: true },
      });
      followedUserIds = new Set(myFollows.map((f) => f.followingId));
    }

    const items = followerUsers.map((u) => ({
      ...u,
      isFollowing: followedUserIds.has(u.id),
      isSelf: currentUserId === u.id,
    }));

    return formatPaginatedResult(items, total, page, limit);
  }

  static async getFollowing(
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

    const [follows, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followerId: user.id },
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          following: {
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
      prisma.follow.count({ where: { followerId: user.id } }),
    ]);

    const followingUsers = follows.map((f) => f.following);

    let followedUserIds = new Set<string>();
    if (currentUserId && followingUsers.length > 0) {
      const myFollows = await prisma.follow.findMany({
        where: {
          followerId: currentUserId,
          followingId: { in: followingUsers.map((u) => u.id) },
        },
        select: { followingId: true },
      });
      followedUserIds = new Set(myFollows.map((f) => f.followingId));
    }

    const items = followingUsers.map((u) => ({
      ...u,
      isFollowing: followedUserIds.has(u.id),
      isSelf: currentUserId === u.id,
    }));

    return formatPaginatedResult(items, total, page, limit);
  }
}
