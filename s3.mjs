import fs from "fs";
import S3rver from "s3rver";

new S3rver({
  port: 9000,
  address: "0.0.0.0",
  directory: "./s3",
  configureBuckets: [
    {
      name: "get-social",
      configs: [fs.readFileSync("./cors.xml")],
    },
  ],
}).run();
