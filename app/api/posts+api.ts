import { createAuthenticatedEndpoint } from "@/util/auth";
import { db } from "../../db";
import {
  followers,
  notifications,
  posts,
  profiles,
  likes,
} from "../../db/schema";
import { desc, eq, and, sql } from "drizzle-orm";

export type GetPostsResponse = {
  id: number;
  content: string;
  userId: string;
  createdAt: Date;
  profile: { displayName: string };
  isLiked: boolean;
  likeCount: number;
}[];

export const GET = createAuthenticatedEndpoint(
  async (request: Request, userId: string) => {
    const allPosts = await db
      .select({
        id: posts.id,
        content: posts.content,
        userId: posts.userId,
        createdAt: posts.createdAt,
        profile: {
          displayName: profiles.displayName,
        },
        isLiked: sql<boolean>`EXISTS (
          SELECT 1 FROM ${likes}
          WHERE ${likes.postId} = ${posts.id}
          AND ${likes.userId} = ${userId}
        )`,
        likeCount: sql<number>`(
          SELECT COUNT(*) FROM ${likes}
          WHERE ${likes.postId} = ${posts.id}
        )`,
      })
      .from(posts)
      .leftJoin(profiles, eq(posts.userId, profiles.userId))
      .orderBy(desc(posts.createdAt))
      .limit(10);

    return Response.json(allPosts);
  }
);

export const POST = createAuthenticatedEndpoint(
  async (request: Request, userId: string) => {
    const body = await request.json();
    const { content } = body;
    const newPost = await db
      .insert(posts)
      .values({ userId, content })
      .returning();

    const userFollowers = await db.query.followers.findMany({
      where: eq(followers.followingId, userId),
    });

    if (userFollowers.length > 0) {
      await Promise.all(
        userFollowers.map((follower) =>
          db.insert(notifications).values({
            userId: follower.followerId,
            actorId: userId,
            type: "post",
          })
        )
      );
    }

    return Response.json(newPost[0]);
  }
);
