import { s3Client } from "@/lib/s3";
import { createAuthenticatedEndpoint } from "@/util/auth";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { v4 as uuidv4 } from "uuid";

export const POST = createAuthenticatedEndpoint(async (request: Request) => {
  const id = uuidv4();

  const { url, fields } = await createPresignedPost(s3Client, {
    Bucket: process.env.STORAGE_BUCKET_NAME!,
    Key: id,
    Conditions: [
      ["content-length-range", 0, 5 * 1024 * 1024],
      ["starts-with", "$Content-Type", "image/"],
    ],
    Expires: 600,
  });

  const finalUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:9000/get-social/"
      : url;

  return new Response(JSON.stringify({ url: finalUrl, fields }), {
    status: 200,
  });
});
