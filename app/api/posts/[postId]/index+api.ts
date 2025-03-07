import { createAuthenticatedEndpoint } from "@/util/auth";
import { db } from "@/db";
import { likes, posts } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const DELETE = createAuthenticatedEndpoint(
  async (request: Request, userId: string) => {
    const url = new URL(request.url);
    const postId = parseInt(url.pathname.split("/").pop() || "");

    if (!postId || isNaN(postId)) {
      return new Response("Valid numeric post ID is required", { status: 400 });
    }

    // Verify the post belongs to the user
    const post = await db.query.posts.findFirst({
      where: and(eq(posts.id, postId), eq(posts.userId, userId)),
    });

    if (!post) {
      return new Response("Post not found or unauthorized", { status: 404 });
    }

    // Delete the post and associated likes
    await db.delete(likes).where(eq(likes.postId, postId));
    await db.delete(posts).where(eq(posts.id, postId));

    return new Response(null, { status: 204 });
  }
);
