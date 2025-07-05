/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import sharp from "sharp";
import { getFileUrl, uploadFile } from "@/lib/cloudeFlare";
import { Prisma } from "@prisma/client";

export async function createCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const image = formData.get("imageUrl") as File
    const visible = formData.get("visible") === "true" ? true : false; // Assuming you want to handle visibility
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

    const category = await prisma.category.create({
      data: {
        name,
        description: description || null,
        imageUrl: imageUrl || "",
        visible,
      },
    })

    revalidatePath("/")
    return { success: true, data: category }
  } catch (error) {
    console.error("Error creating category:", error)
    return { success: false, error: "Failed to create category" }
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
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

    const updateData: Prisma.CategoryUpdateInput = {
      name,
      description: description || null,
      ...(typeof visible !== "undefined" && { visible }),
      ...(imageUrl && { imageUrl }),
    };

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");

    return { success: true, data: category };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting category:", error)
    return { success: false, error: "Failed to delete category" }
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    })
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}
