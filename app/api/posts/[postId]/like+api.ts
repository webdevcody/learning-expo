import { db } from "@/db";
import { likes, notifications, posts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { createAuthenticatedEndpoint } from "@/util/auth";

export const POST = createAuthenticatedEndpoint(
  async (request: Request, currentUserId: string) => {
    const url = new URL(request.url);
    const postId = parseInt(url.pathname.split("/")[3]);

    // Check if already liked
    const existingLike = await db.query.likes.findFirst({
      where: and(eq(likes.userId, currentUserId), eq(likes.postId, postId)),
    });

    if (existingLike) {
      // Unlike
      await db
        .delete(likes)
        .where(and(eq(likes.userId, currentUserId), eq(likes.postId, postId)));

      return Response.json({ liked: false });
    } else {
      // Like
      await db.insert(likes).values({
        userId: currentUserId,
        postId: postId,
      });

      // Get post author
      const post = await db.query.posts.findFirst({
        where: eq(posts.id, postId),
      });

      if (post && post.userId !== currentUserId) {
        // Create notification for the post author
        await db.insert(notifications).values({
          userId: post.userId,
          actorId: currentUserId,
          type: "like",
        });
      }

      return Response.json({ liked: true });
    }
  }
);
