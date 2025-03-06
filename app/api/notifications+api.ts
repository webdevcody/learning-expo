import { db } from "@/db";
import { notifications, profiles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { createAuthenticatedEndpoint } from "@/util/auth";

export type GetNotificationsResponse = {
  id: number;
  type: string;
  createdAt: Date;
  userId: string;
  actor: {
    userId: string;
    displayName: string;
  };
}[];

export const GET = createAuthenticatedEndpoint(
  async (request: Request, userId: string) => {
    const userNotifications = await db
      .select({
        id: notifications.id,
        type: notifications.type,
        userId: notifications.userId,
        createdAt: notifications.createdAt,
        actor: {
          userId: profiles.userId,
          displayName: profiles.displayName,
        },
      })
      .from(notifications)
      .leftJoin(profiles, eq(notifications.actorId, profiles.userId))
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(50);

    return Response.json(userNotifications);
  }
);
