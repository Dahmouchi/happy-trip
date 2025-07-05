/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import sharp from "sharp";
import { getFileUrl, uploadFile } from "@/lib/cloudeFlare";
import { Destination, Prisma } from "@prisma/client";

export async function createDestination(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const type = formData.get("type") as "NATIONAL" | "INTERNATIONAL";
    const image = formData.get("imageUrl") as File;
    const visible = formData.get("visible") === "true" ? true : false;
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
    const imageUrl = getFileUrl(filename); // Assuming Key contains the file name

    const destination = await prisma.destination.create({
      data: {
        name,
        type,
        imageUrl: imageUrl || "",
        visible,
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

    const visibleRaw = formData.get("visible");
    const visible = visibleRaw === null ? undefined : visibleRaw === "true";

    const quality = 80;
    let imageUrl: string | null = null;

    if (image && typeof image.arrayBuffer === "function") {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `${timestamp}-${image.name}`;
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const resizedImage = await sharp(buffer)
        .resize(1200)
        .jpeg({ quality })
        .toBuffer();

      await uploadFile(resizedImage, filename, image.type);
      imageUrl = getFileUrl(filename);
    }

    const updateData: Prisma.DestinationUpdateInput = {
      name,
      type,
      ...(typeof visible !== "undefined" && { visible }),
      ...(imageUrl && { imageUrl }),
    };

    const destination = await prisma.destination.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");

    return { success: true, data: destination };
  } catch (error) {
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


export async function getNationalDestinations() {
  try {
    const destinations = await prisma.destination.findMany({
      where: { type: "NATIONAL"},
      orderBy: { name: "asc" },
    })
    return destinations
  }
  catch (error) {
    console.error("Error fetching national destinations:", error)
    return []
  }
}

export async function getInternationalDestinations() {
  try {
    const destinations = await prisma.destination.findMany({
      where: { type: "INTERNATIONAL"},
      orderBy: { name: "asc" },
    })
    return destinations
  }
  catch (error) {
    console.error("Error fetching international destinations:", error)
    return []
  }
}