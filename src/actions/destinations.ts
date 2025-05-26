"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createDestination(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const type = formData.get("type") as "NATIONAL" | "INTERNATIONAL" | "EN_MESURE"
    const imageUrl = formData.get("imageUrl") as string

    const destination = await prisma.destination.create({
      data: {
        name,
        type,
        imageUrl: imageUrl || null,
      },
    })

    revalidatePath("/")
    return { success: true, data: destination }
  } catch (error) {
    console.error("Error creating destination:", error)
    return { success: false, error: "Failed to create destination" }
  }
}

export async function updateDestination(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const type = formData.get("type") as "NATIONAL" | "INTERNATIONAL" | "EN_MESURE"
    const imageUrl = formData.get("imageUrl") as string

    const destination = await prisma.destination.update({
      where: { id },
      data: {
        name,
        type,
        imageUrl: imageUrl || null,
      },
    })

    revalidatePath("/")
    return { success: true, data: destination }
  } catch (error) {
    console.error("Error updating destination:", error)
    return { success: false, error: "Failed to update destination" }
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
