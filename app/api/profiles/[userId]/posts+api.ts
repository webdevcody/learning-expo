import { createAuthenticatedEndpoint } from "@/util/auth";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export type GetPostsResponse = {
  id: number;
  content: string;
  userId: string;
  createdAt: Date;
}[];

export const GET = createAuthenticatedEndpoint(
  async (request: Request, userId: string) => {
    const allPosts = await db
      .select({
        id: posts.id,
        content: posts.content,
        userId: posts.userId,
        createdAt: posts.createdAt,
      })
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt))
      .limit(20);
    return Response.json(allPosts);
  }
);
