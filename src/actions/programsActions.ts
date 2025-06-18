'use server'

import prisma from "@/lib/prisma";
import { uploadImage } from "@/utils/uploadImage";


type UpdateProgramInput = {
  title: string;
  description?: string;
  image?: File | string; // Either new image Buffer or existing URL
};

export async function updateProgram(id: string, data: UpdateProgramInput) {
  try {
    const existingProgram = await prisma.program.findUnique({
      where: { id: id },
    });

    if (!existingProgram) {
      return { success: false, error: "Program not found" };
    }

    let imageUrl = existingProgram.imageUrl;

    // Check if a new image is provided
    if (data.image && typeof data.image !== "string") {
      // New file uploaded as Buffer → upload and update
      imageUrl = await uploadImage(data.image);
    } else if (typeof data.image === "string" && data.image !== existingProgram.imageUrl) {
      // Different image URL provided → use it
      imageUrl = data.image;
    }
    // else: same image or no image passed → keep old one

    // Perform the update
    const updatedProgram = await prisma.program.update({
      where: { id: id },
      data: {
        title: data.title,
        description: data.description,
        imageUrl,
      },
    });

    return { success: true, data: updatedProgram };
  } catch (error) {
    console.error("Error updating program:", error);
    return { success: false, error: "Failed to update program" };
  }
}
