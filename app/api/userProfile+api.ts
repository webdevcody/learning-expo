import { db } from "@/db";
import { createAuthenticatedEndpoint } from "@/util/auth";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export type UpdateProfileBody = {
  displayName: string;
};

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

export const PUT = createAuthenticatedEndpoint(
  async (request: Request, userId: string) => {
    const body = (await request.json()) as UpdateProfileBody;

    if (!body.displayName || body.displayName.trim().length < 4) {
      return Response.json(
        { error: "Display name must be at least 4 characters long" },
        { status: 400 }
      );
    }

    const updatedProfile = await db
      .update(profiles)
      .set({
        displayName: body.displayName.trim(),
      })
      .where(eq(profiles.userId, userId))
      .returning();

    return Response.json(updatedProfile[0]);
  }
);
