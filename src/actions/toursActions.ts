"use server"

import { PrismaClient, type TravelType } from "@prisma/client"
import { z } from "zod"

const prisma = new PrismaClient()

// Schema for validating tour data
const tourSchema = z.object({
  title: z.string().min(3, {
    message: "Le titre doit comporter au moins 3 caractères.",
  }),
  description: z.string().optional(),
  type: z.enum(["NATIONAL", "INTERNATIONAL"]),
  location: z.string().optional(),
  priceOriginal: z.coerce.number().int().positive().optional(),
  priceDiscounted: z.coerce.number().int().positive().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  durationDays: z.coerce.number().int().positive().optional(),
  durationNights: z.coerce.number().int().positive().optional(),
  accommodation: z.string().optional(),
  imageUrl: z.string().url().optional(),
  groupType: z.string().optional(),
  groupSizeMax: z.coerce.number().int().positive().optional(),
  showReviews: z.boolean(),
  showDifficulty: z.boolean(),
  showDiscount: z.boolean(),
  difficultyLevel: z.coerce.number().int().min(1).max(5).optional(),
  discountPercent: z.coerce.number().int().min(0).max(100).optional(),
  weekendsOnly: z.boolean(),
  vacationStyles: z.array(z.string()),
})

export type TourFormData = z.infer<typeof tourSchema>

/**
 * Server action to add a new tour to the database
 */
export async function addTour(formData: TourFormData) {
  try {
    // Validate the form data
    const validatedData = tourSchema.parse(formData)

    console.log(validatedData)
 // Create the tour in the database
    const tour = await prisma.tour.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type as TravelType,
        location: validatedData.location,
        priceOriginal: validatedData.priceOriginal,
        priceDiscounted: validatedData.priceDiscounted,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        durationDays: validatedData.durationDays,
        durationNights: validatedData.durationNights,
        accommodation: validatedData.accommodation,
        imageUrl: validatedData.imageUrl,
        groupType: validatedData.groupType,
        groupSizeMax: validatedData.groupSizeMax,
        showReviews: validatedData.showReviews,
        showDifficulty: validatedData.showDifficulty,
        showDiscount: validatedData.showDiscount,
        difficultyLevel: validatedData.difficultyLevel,
        discountPercent: validatedData.discountPercent,
        weekendsOnly: validatedData.weekendsOnly,
        // Connect the vacation styles
      },
    })
    // Revalidate the tours page to show the new tour
    // revalidatePath("/tours")

    return { success: true, data: tour }
  } catch (error) {
    
    console.error("Error adding tour:", error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation error",
        details: error.errors,
      }
    }

    return {
      success: false,
      error: "Failed to add tour",
    }
  } finally {
    await prisma.$disconnect()
  }
}
