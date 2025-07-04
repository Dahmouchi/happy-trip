import sharp from "sharp";
import { getFileUrl, uploadFile } from "@/lib/cloudeFlare";

export async function uploadImage(imageURL: File): Promise<string> {
  const image = imageURL;
  const quality = 80;

  // 1️⃣ Generate unique filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${timestamp}-${image.name}`;

  // 2️⃣ Read & compress with sharp
  const arrayBuffer = await image.arrayBuffer();
  const compressedBuffer = await sharp(arrayBuffer)
    .resize(1200)
    .jpeg({ quality })
    .toBuffer();

  // 3️⃣ Upload
  const fileContent = Buffer.from(compressedBuffer);
  await uploadFile(fileContent, filename, image.type);

  // 4️⃣ Return URL — use the same filename!
  return getFileUrl(filename);
}
