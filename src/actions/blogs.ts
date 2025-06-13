"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import sharp from "sharp";
import { getFileUrl, uploadFile } from "@/lib/cloudeFlare";


export async function createBlog(formData: FormData) {
  try {
    const name = formData.get("title") as string
    const description = formData.get("description") as string
    const image = formData.get("imageUrl") as File
    const status = formData.get("status") === "true"; // Convert string to boolean
     const category = formData.get("category") as string
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

    const blog = await prisma.blog.create({
      data: {
        title:name,
        description: description || null,
        imageUrl: imageUrl || "",
        category:category,
        status:status,
      },
    })

    revalidatePath("/")
    return { success: true, data: blog }
  } catch (error) {
    console.error("Error creating category:", error)
    return { success: false, error: "Failed to create category" }
  }
}


export async function updateBlog(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const status = formData.get("status") === "true"; // Convert string to boolean
    const imageFile = formData.get("imageUrl") as File | null;

    // Get current blog data to check for existing image
    const currentBlog = await prisma.blog.findUnique({
      where: { id }
    });

    let imageUrl = currentBlog?.imageUrl || null;

    // Only process image if a new file was uploaded
    if (imageFile && imageFile.size > 0) {
      const quality = 80;
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `${timestamp}-${imageFile.name}`;
      
      const arrayBuffer = await imageFile.arrayBuffer();
      const optimizedImage = await sharp(arrayBuffer)
        .resize(1200)
        .jpeg({ quality })
        .toBuffer();

      const uploadResponse = await uploadFile(optimizedImage, filename, imageFile.type);
      imageUrl = getFileUrl(uploadResponse.Key);

      // TODO: Add logic to delete old image if needed
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        title,
        description: description || null,
        imageUrl,
        category: category || null,
        status,
      },
    });

    revalidatePath("/");
    return { success: true, data: updatedBlog };
  } catch (error) {
    console.error("Error updating blog:", error);
    return { success: false, error: "Failed to update blog" };
  }
}

export async function deleteBlog(id: string) {
  try {
    await prisma.blog.delete({
      where: { id },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting category:", error)
    return { success: false, error: "Failed to delete category" }
  }
}

export async function getBlogs() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "asc" },
    })
    return blogs
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}
