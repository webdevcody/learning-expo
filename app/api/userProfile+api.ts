import { db } from "@/db";
import { createAuthenticatedEndpoint } from "@/util/auth";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export const GET = createAuthenticatedEndpoint(
  async (request: Request, userId: string) => {
    let existingProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));

    if (!existingProfile || existingProfile.length === 0) {
      // Create default profile with random handle and display name
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const defaultProfile = {
        userId,
        handle: `user_${randomSuffix}`,
        displayName: `User ${randomSuffix}`,
      };

      const newProfile = await db
        .insert(profiles)
        .values(defaultProfile)
        .returning();

      return Response.json(newProfile[0]);
    } else {
      return Response.json(existingProfile[0]);
    }
  }
);
