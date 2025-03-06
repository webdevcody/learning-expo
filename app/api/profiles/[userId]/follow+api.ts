import { db } from "@/db";
import { followers, notifications } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { createAuthenticatedEndpoint } from "@/util/auth";

export const POST = createAuthenticatedEndpoint(
  async (request: Request, currentUserId: string) => {
    const url = new URL(request.url);
    const targetUserId = url.pathname.split("/")[3];

    if (currentUserId === targetUserId) {
      return new Response("Cannot follow yourself", { status: 400 });
    }

    // Check if already following
    const existingFollow = await db.query.followers.findFirst({
      where: and(
        eq(followers.followerId, currentUserId),
        eq(followers.followingId, targetUserId)
      ),
    });

    if (existingFollow) {
      // Unfollow
      await db
        .delete(followers)
        .where(
          and(
            eq(followers.followerId, currentUserId),
            eq(followers.followingId, targetUserId)
          )
        );

      // Create notification for the target user
      await db.insert(notifications).values({
        userId: targetUserId,
        actorId: currentUserId,
        type: "unfollow",
      });

      return Response.json({ following: false });
    } else {
      // Follow
      await db.insert(followers).values({
        followerId: currentUserId,
        followingId: targetUserId,
      });

      // Create notification for the target user
      await db.insert(notifications).values({
        userId: targetUserId,
        actorId: currentUserId,
        type: "follow",
      });

      return Response.json({ following: true });
    }
  }
);

export const GET = createAuthenticatedEndpoint(
  async (request: Request, currentUserId: string) => {
    const url = new URL(request.url);
    const targetUserId = url.pathname.split("/")[3];

    const existingFollow = await db.query.followers.findFirst({
      where: and(
        eq(followers.followerId, currentUserId),
        eq(followers.followingId, targetUserId)
      ),
    });

    return Response.json({ following: !!existingFollow });
  }
);
