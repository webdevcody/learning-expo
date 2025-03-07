import { S3Client } from "@aws-sdk/client-s3";

const isLocalS3 = process.env.USE_LOCAL_S3 === "true";

export const s3Client = new S3Client({
  region: "us-east-1",
  ...(isLocalS3 && {
    endpoint: "http://localhost:9000",
    credentials: {
      accessKeyId: "S3RVER",
      secretAccessKey: "S3RVER",
    },
    forcePathStyle: true,
  }),
});
