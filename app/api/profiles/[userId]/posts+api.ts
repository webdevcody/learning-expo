import { createAuthenticatedEndpoint } from "@/util/auth";
import { db } from "@/db";
import { posts, profiles, likes } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export type GetPostsResponse = {
  id: number;
  content: string;
  userId: string;
  createdAt: Date;
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
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt))
      .limit(20);
    return Response.json(allPosts);
  }
);
