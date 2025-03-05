import { db } from "@/db";
import { followers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createAuthenticatedEndpoint } from "@/util/auth";

export type GetUserStatsResponse = {
  followerCount: number;
  followingCount: number;
};

export const GET = createAuthenticatedEndpoint(
  async (request: Request, currentUserId: string) => {
    const url = new URL(request.url);
    const targetUserId = url.pathname.split("/")[3];

    const [followerCount, followingCount] = await Promise.all([
      db
        .select({ count: followers.followerId })
        .from(followers)
        .where(eq(followers.followingId, targetUserId))
        .then((result) => result.length),
      db
        .select({ count: followers.followingId })
        .from(followers)
        .where(eq(followers.followerId, targetUserId))
        .then((result) => result.length),
    ]);

    return Response.json({
      followerCount,
      followingCount,
    });
  }
);
