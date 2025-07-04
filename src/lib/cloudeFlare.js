import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Create the v3 S3 client
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_CLOUD_FLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_CLOUD_FLARE_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.NEXT_PUBLIC_CLOUD_FLARE_ENDPOINT,
  region: process.env.NEXT_PUBLIC_CLOUD_FLARE_REGION,
  forcePathStyle: true, // 👈 important for R2 compatibility!
  signatureVersion: "v4", // optional: v3 uses SigV4 by default
});

export const uploadFile = async (fileContent, fileName, mimeType) => {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_CLOUD_FLARE_BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
    ContentType: mimeType,
  };

  const command = new PutObjectCommand(params);

  return await s3.send(command);
};

export const getFileUrl = (fileName) => {
  const endpoint = "https://pub-8e718d4717894c2d8394aa3ab82551f4.r2.dev";
  const bucket = process.env.NEXT_PUBLIC_CLOUD_FLARE_BUCKET_NAME;

  return `${endpoint}/${bucket}/${fileName}`;
};
