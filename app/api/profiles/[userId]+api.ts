import { db } from "@/db";
import { createAuthenticatedEndpoint } from "@/util/auth";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export type GetProfileResponse = {
  id: string;
  displayName: string;
  handle: string;
};

export const GET = createAuthenticatedEndpoint(
  async (request: Request, userId: string) => {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    if (!profile) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    return Response.json(profile);
  }
);
