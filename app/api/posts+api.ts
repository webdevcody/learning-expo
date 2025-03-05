import { createAuthenticatedEndpoint } from "@/util/auth";
import { db } from "../../db";
import { posts } from "../../db/schema";
import { desc } from "drizzle-orm";

export const GET = createAuthenticatedEndpoint(
  async (request: Request, userId: string) => {
    const allPosts = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(10);
    return Response.json(allPosts);
  }
);

export const POST = createAuthenticatedEndpoint(
  async (request: Request, userId: string) => {
    const body = await request.json();
    const { title, content } = body;
    const newPost = await db.insert(posts).values({ content }).returning();
    return Response.json(newPost[0]);
  }
);
