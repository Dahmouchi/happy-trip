import sharp from "sharp";
import { getFileUrl, uploadFile } from "@/lib/cloudeFlare";

 
 export async function uploadImage(imageURL: File): Promise<string> {
     
      const image = imageURL ;
      const quality = 80;

      // Step 1: Generate unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `${timestamp}-${image.name}`;

      // Step 2: Read and compress the image with sharp
      const arrayBuffer = await image.arrayBuffer();
      const compressedBuffer = await sharp(arrayBuffer)
        .resize(1200) // Resize width to 1200px, keeping aspect ratio
        .jpeg({ quality }) // or .png({ compressionLevel: 9 }) if needed
        .toBuffer();

      // Step 3: Upload the file
      const fileContent = Buffer.from(compressedBuffer);
      const uploadResponse = await uploadFile(fileContent, filename, image.type);

      // Step 4: Return the public URL
      const imageUrl = getFileUrl(uploadResponse.Key); // Key is usually the filename or path
      return (imageUrl);
  }