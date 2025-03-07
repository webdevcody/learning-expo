import { s3Client } from "@/lib/s3";
import { createAuthenticatedEndpoint } from "@/util/auth";
import { createPresignedPost } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

export const POST = createAuthenticatedEndpoint(async (request: Request) => {
  const id = uuidv4();

  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: process.env.STORAGE_BUCKET_NAME,
    Key: id,
    Conditions: [
      ["content-length-range", 0, 5 * 1024 * 1024], // up to 5MB
      ["eq", "$Content-Type", "image/jpeg"],
    ],
    Fields: {
      "Content-Type": "image/jpeg",
    },
    Expires: 600,
  });

  return new Response(JSON.stringify({ url, fields }), {
    status: 200,
  });
});
