'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"




export async function getServices() {
     try {
    const services = await prisma.service.findMany({
      orderBy: { name: "asc" },
    })
    return services
  } catch (error) {
    console.error("Error fetching services:", error)
    return []
  }
}

export async function createService(formData: FormData) {
    try {
        const service = await prisma.service.create({
        data: {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
        },
        })
        return service
    } catch (error) {
        console.error("Error creating service:", error)
        throw error
    }
}

export async function updateService(id: string, formData: FormData) {
    try {
        const service = await prisma.service.update({
            where: { id },
            data: {
                name: formData.get("name") as string,
                description: formData.get("description") as string,
            },
        })
        return service
    } catch (error) {
        console.error("Error updating service:", error)
        throw error
    }
}

export async function deleteService(id: string) {
    try {
    await prisma.service.delete({
      where: { id },
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting service:", error)
    return { success: false, error: "Failed to delete service" }
  }
}

export async function getServiceById(id: string) {
    try {
        const service = await prisma.service.findUnique({
            where: { id },
        })
        return service
    } catch (error) {
        console.error("Error fetching service by ID:", error)
        throw error
    }
}