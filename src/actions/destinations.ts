"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import sharp from "sharp";
import { getFileUrl, uploadFile } from "@/lib/cloudeFlare";

export async function createDestination(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const type = formData.get("type") as "NATIONAL" | "INTERNATIONAL";
    const image = formData.get("imageUrl") as File;
    const quality = 80;

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${timestamp}-${image.name}`;
    const arrayBuffer = await image.arrayBuffer();
    const test = await sharp(arrayBuffer)
      .resize(1200)
      .jpeg({ quality }) // or .png({ compressionLevel: 9 })
      .toBuffer();

    const fileContent = Buffer.from(test);

    const uploadResponse = await uploadFile(fileContent, filename, image.type);
    const imageUrl = getFileUrl(uploadResponse.Key); // Assuming Key contains the file name

    const destination = await prisma.destination.create({
      data: {
        name,
        type,
        imageUrl: imageUrl || null,
      },
    });

    revalidatePath("/");
    return { success: true, data: destination };
  } catch (error) {
    console.error("Error creating destination:", error);
    return { success: false, error: "Failed to create destination" };
  }
}

export async function updateDestination(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const type = formData.get("type") as "NATIONAL" | "INTERNATIONAL";
    const image = formData.get("imageUrl") as File;
    const quality = 80;
    let imageUrl: string | null = null;
    
    if (image) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `${timestamp}-${image.name}`;
      const arrayBuffer = await image.arrayBuffer();
      const test = await sharp(arrayBuffer)
        .resize(1200)
        .jpeg({ quality }) // or .png({ compressionLevel: 9 })
        .toBuffer();

      const fileContent = Buffer.from(test);

      const uploadResponse = await uploadFile(fileContent, filename, image.type);
      imageUrl = getFileUrl(uploadResponse.Key); // Assuming Key contains the file name
    }
    const destination = await prisma.destination.update({
      where: { id },
      data: {
        name,
        type,
        imageUrl: imageUrl || null, // Use the new image URL if provided, otherwise keep it null
      },
    })
    revalidatePath("/");
    return { success: true, data: destination }
  }
  catch (error) {
    console.error("Error updating destination:", error);
    return { success: false, error: "Failed to update destination" };
  }
}

export async function deleteDestination(id: string) {
  try {
    await prisma.destination.delete({
      where: { id },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting destination:", error)
    return { success: false, error: "Failed to delete destination" }
  }
}

export async function getDestinations() {
  try {
    const destinations = await prisma.destination.findMany({
      orderBy: { name: "asc" },
    })
    return destinations
  } catch (error) {
    console.error("Error fetching destinations:", error)
    return []
  }
}
