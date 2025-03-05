import { createAuthenticatedEndpoint } from "@/util/auth";
import { db } from "../../db";
import { posts, profiles } from "../../db/schema";
import { desc, eq } from "drizzle-orm";

export type GetPostsResponse = {
  id: number;
  content: string;
  userId: string;
  createdAt: Date;
  profile: { displayName: string; handle: string };
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
          handle: profiles.handle,
        },
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
    return Response.json(newPost[0]);
  }
);
