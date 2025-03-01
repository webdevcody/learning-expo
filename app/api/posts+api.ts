import { db } from "../../db";
import { posts } from "../../db/schema";

export async function GET(request: Request) {
  const allPosts = await db.select().from(posts);
  return Response.json(allPosts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, content } = body;

  const newPost = await db.insert(posts).values({ title, content });

  return Response.json(newPost);
}
