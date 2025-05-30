/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { PrismaClient, type TravelType } from "@prisma/client"
import { z } from "zod"
import { getFileUrl, uploadFile } from "@/lib/cloudeFlare";
// import sharp from "sharp";

const prisma = new PrismaClient()

// Schema for validating tour data
const tourSchema = z.object({
  title: z.string().min(3, {
    message: "Le titre doit comporter au moins 3 caractères.",
  }),
  description: z.string().optional(),
  type: z.enum(["NATIONAL", "INTERNATIONAL"]).optional(),
  priceOriginal: z.coerce.number().int().positive().optional(),
  priceDiscounted: z.coerce.number().int().positive().optional(),
  dateCard: z.string().optional(),
  // startDate: z.coerce.date().optional(),
  // endDate: z.coerce.date().optional(),
  durationDays: z.coerce.number().int().positive().optional(),
  durationNights: z.coerce.number().int().positive().optional(),
  accommodation: z.string().optional(),
  imageUrl: z.string().url().optional(),
  destination: z.string().optional(),
  activite: z.string().optional(),
  inclu: z.string().optional(),
  exclu: z.string().optional(),
  groupType: z.string().optional(),
  groupSizeMax: z.coerce.number().int().positive().optional(),
  showReviews: z.boolean().optional(),
  showDifficulty: z.boolean().optional(),
  showDiscount: z.boolean().optional(),
  difficultyLevel: z.coerce.number().int().min(1).max(5).optional(),
  totalReviews: z.coerce.number().int().min(0).optional(),
  averageRating: z.coerce.number().min(0).optional(),
  discountPercent: z.coerce.number().int().min(0).max(100).optional(),
  weekendsOnly: z.boolean().optional(),
  accommodationType: z.string().optional(),
  // Relations (arrays of strings or IDs, adjust as needed for your use case)
  programs: z.array(z.string()).optional(),
  dates: z
    .array(
      z.object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        description: z.string().optional(),
      })
    )
    .optional(),
  destinations: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  natures: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
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
    // Upload images to Cloudflare and get their URLs
  
    

    const tour = await prisma.tour.create({
      data: {
      title: validatedData.title,
      description: validatedData.description,
      type: validatedData.type as TravelType,
      priceOriginal: validatedData.priceOriginal,
      priceDiscounted: validatedData.priceDiscounted,
      dateCard: validatedData.dateCard,
      // startDate: validatedData.startDate,
      // endDate: validatedData.endDate,
      durationDays: validatedData.durationDays,
      durationNights: validatedData.durationNights,
      accommodation: "",
      imageUrl: validatedData.imageUrl,
      destination: validatedData.destination,
      activite: validatedData.activite,
      inclu: validatedData.inclu,
      exclu: validatedData.exclu,
      groupType: validatedData.groupType,
      groupSizeMax: validatedData.groupSizeMax,
      showReviews: validatedData.showReviews,
      showDifficulty: validatedData.showDifficulty,
      showDiscount: validatedData.showDiscount,
      difficultyLevel: validatedData.difficultyLevel,
      totalReviews: validatedData.totalReviews,
      averageRating: validatedData.averageRating,
      discountPercent: validatedData.discountPercent,
      weekendsOnly: validatedData.weekendsOnly,
      accommodationType: validatedData.accommodationType,

      // Relations
      dates: validatedData.dates
        ? {
          create: validatedData.dates.map((dateObj) => ({
          startDate: dateObj.startDate,
          endDate: dateObj.endDate,
          description: dateObj.description,
          })),
        }
        : undefined,
      destinations: validatedData.destinations
        ? {
          connect: validatedData.destinations.map((id) => ({ id })),
        }
        : undefined,
      categories: validatedData.categories
        ? {
          connect: validatedData.categories.map((id) => ({ id })),
        }
        : undefined,
      natures: validatedData.natures
        ? {
          connect: validatedData.natures.map((id) => ({ id })),
        }
        : undefined,
      images: validatedData.images?.length
        ? {
            create: validatedData.images
              .filter((img) => !!img)
              .map((img) => ({ url: img })),
          }
        : undefined,
      programs: validatedData.programs
        ? {
          connect: validatedData.programs.map((id) => ({ id })),
        }
        : undefined,
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
