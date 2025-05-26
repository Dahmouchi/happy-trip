"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createNature(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const imageUrl = formData.get("imageUrl") as string

    const nature = await prisma.nature.create({
      data: {
        name,
        description: description || null,
        imageUrl: imageUrl || null,
      },
    })

    revalidatePath("/")
    return { success: true, data: nature }
  } catch (error) {
    console.error("Error creating nature:", error)
    return { success: false, error: "Failed to create nature" }
  }
}

export async function updateNature(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const imageUrl = formData.get("imageUrl") as string

    await prisma.nature.update({
      where: { id },
      data: {
        name,
        description: description || null,
        imageUrl: imageUrl || null,
      },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error updating nature:", error)
    return { success: false, error: "Failed to update nature" }
  }
}

export async function deleteNature(id: string) {
  try {
    await prisma.nature.delete({
      where: { id },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting nature:", error)
    return { success: false, error: "Failed to delete nature" }
  }
}

export async function getNatures() {
  try {
    const natures = await prisma.nature.findMany({
      orderBy: { name: "asc" },
    })
    return natures
  } catch (error) {
    console.error("Error fetching natures:", error)
    return []
  }
}
