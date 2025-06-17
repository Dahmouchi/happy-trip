/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { PrismaClient, type TravelType } from "@prisma/client"
import { z } from "zod"
import { getFileUrl, uploadFile } from "@/lib/cloudeFlare";
import sharp from "sharp";
import { Video } from "lucide-react";
import { act } from "react";
import axios from "axios";
import { getEmbedGoogleMapsUrl } from "@/utils/getEmbedGoogleMapsUrl";
import { getYouTubeEmbedUrl } from "@/utils/getYouTubeEmbedUrl";
import { uploadImage} from "@/utils/uploadImage";
import { getHotels } from "./hotelsActions";


const prisma = new PrismaClient()

// Schema for validating tour data

const tourSchema = z.object({
  active: z.boolean().default(true),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise").optional(),
  type: z.enum(["NATIONAL", "INTERNATIONAL"]),
  priceOriginal: z.preprocess((val) => val === "" ? undefined : typeof val === "string" ? Number(val) : val, z.number().min(0, "Le prix doit être positif").optional()),
  priceDiscounted: z.preprocess((val) => val === "" ? undefined : typeof val === "string" ? Number(val) : val, z.number().min(0, "Le prix doit être positif").optional()),
  discountEndDate: z.preprocess((val) => val === "" ? undefined : typeof val === "string" ? new Date(val) : val, z.date().optional()),
  advancedPrice: z.preprocess((val) => val === "" ? undefined : typeof val === "string" ? Number(val) : val, z.number().min(0, "Le prix doit être positif").optional()),
  dateCard: z.string().optional(),
  durationDays: z.preprocess((val) => val === "" ? undefined : typeof val === "string" ? Number(val) : val, z.number().min(1, "Au moins 1 jour").optional()),
  durationNights: z.preprocess((val) => val === "" ? undefined : typeof val === "string" ? Number(val) : val, z.number().min(0, "Nuits >= 0").optional()),
 googleMapsUrl: z
    .string()
    .url("Lien Google Maps invalide")
    .optional()
    .or(z.literal("")),
  videoUrl: z
    .string()
    .url("Lien vidéo invalide")
    .optional()
    .or(z.literal("")),
  imageURL: z.instanceof(File).optional().or(z.literal("")).transform(val => val === "" ? undefined : val),
  groupType: z.string().optional(),
  groupSizeMax: z.preprocess((val) => val === "" ? undefined : typeof val === "string" ? Number(val) : val, z.number().min(1, "Taille min 1").optional()),
  showReviews: z.boolean().default(true),
  showDifficulty: z.boolean().default(true),
  showDiscount: z.boolean().default(true),
  difficultyLevel: z.number().min(1).max(5).optional().or(z.literal("")).transform(val => val === "" ? undefined : val),
  discountPercent: z.preprocess(val => val === "" ? undefined : typeof val === "string" ? Number(val) : val, z.number().min(0).max(100).optional()),
  accommodationType: z.string().optional(),
  googleMapsLink: z.string().url("Lien Google Maps invalide").optional().or(z.literal("")),
  programs: z
  .array(
    z.object({
      id: z.string().optional(),
      title: z.string().min(1, "Titre requis"),
      description: z.string().optional(),
      image: z
        .union([z.instanceof(File), z.string()])
        .optional()
        .transform((val) => {
          if (val === "" || val === undefined) return undefined;
          return val;
        }),
    })
  )
  .optional(),

  dates: z.array(
    z.object({
      startDate: z.date(),
      endDate: z.date(),
      description: z.string().optional(),
    })
  ).optional(),
  images: z.array(
    z.object({
      link: z.instanceof(File).optional().or(z.literal("")).transform(val => val === "" ? undefined : val),
    })
  ),
  hotels: z.array(z.string()).optional(),
  services: z.array(z.string()),
  destinations: z.array(z.string()),
  categories: z.array(z.string()),
  natures: z.array(z.string()),
  inclus: z.string(),
  exclus: z.string(),
  arrayInclus: z.array(z.string()),
  arrayExlus: z.array(z.string()),
});

export type TourFormData = z.infer<typeof tourSchema>
 

 

  export async function addTour(formData: TourFormData) {
  try {
    // Validate the form data
    const validatedData = tourSchema.parse(formData)
    
    console.log(validatedData)
    // Create the tour in the database
  
    const tour = await prisma.tour.create({
      data: {
      active: validatedData.active, // Default to true if not provided
      title: validatedData.title,
      description: validatedData.description,
      type: validatedData.type as TravelType,
      priceOriginal: validatedData.priceOriginal,
      priceDiscounted: validatedData.priceDiscounted,
      discountEndDate: validatedData.discountEndDate ? new Date(validatedData.discountEndDate) : null,
      advancedPrice: validatedData.advancedPrice,
      dateCard: validatedData.dateCard,
      durationDays: validatedData.durationDays,
      durationNights: validatedData.durationNights,
      googleMapsUrl: validatedData.googleMapsUrl
        ? (await getEmbedGoogleMapsUrl(validatedData.googleMapsUrl)) ?? ""
        : "",
      videoUrl: validatedData.videoUrl ? (await getYouTubeEmbedUrl(validatedData.videoUrl)) || "" : "", // Convert YouTube URL to embed format
      imageUrl: validatedData.imageURL ? await uploadImage(validatedData.imageURL) : "", // Upload image and get URL
      inclus: validatedData.inclus,
      exclus: validatedData.exclus,
      groupType: validatedData.groupType,
      groupSizeMax: validatedData.groupSizeMax,
      showReviews: validatedData.showReviews,
      showDifficulty: validatedData.showDifficulty,
      showDiscount: validatedData.showDiscount,
      difficultyLevel: validatedData.difficultyLevel,
      discountPercent: validatedData.discountPercent,
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
      
      hotels: validatedData.hotels
        ? {
          connect: validatedData.hotels.map((id) => ({ id })),
        }
        : undefined,

      services: validatedData.services
        ? {
          connect: validatedData.services.map((id) => ({ id })),
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
      
      images: validatedData.images
      ? {
        create: await Promise.all(
          validatedData.images.map(async (image) => ({
            url: image.link ? await uploadImage(image.link) : "",
          }))
        )
      }
      : undefined,

      programs: validatedData.programs
  ? {
      create: await Promise.all(
        validatedData.programs.map(async (program) => {
          let imageUrl = "";

          if (program.image instanceof File) {
            imageUrl = await uploadImage(program.image);
          } else if (typeof program.image === "string") {
            imageUrl = program.image;
          }

          return {
            title: program.title,
            description: program.description,
            imageUrl,
          };
        })
      ),
    }
  : undefined,
      },
    })
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

export async function getAllTours() {
  try {
    const tours = await prisma.tour.findMany({
      include: {
        destinations: true,
        categories: true,
        natures: true,
        programs: true,
        images: true,
      },
    })
    return { success: true, data: tours }
  } catch (error) {
    console.error("Error fetching tours:", error)
    return { success: false, error: "Failed to fetch tours" }
  } finally {
    await prisma.$disconnect()
  }
}


export async function deleteTour(tourId: string) {
  try {
    const deletedTour = await prisma.$transaction(async (tx) => {
      // Delete dependent child records (one-to-many)
      await tx.tourDate.deleteMany({ where: { tourId } });
      await tx.program.deleteMany({ where: { tourId } });
      await tx.file.deleteMany({ where: { tourId } }); // only works if relation is one-to-many

      // Delete join table entries (many-to-many)
      await tx.$executeRaw`DELETE FROM "_TourDestinations" WHERE "A" = ${tourId}`;
      await tx.$executeRaw`DELETE FROM "_CategoryTours" WHERE "A" = ${tourId}`;
      await tx.$executeRaw`DELETE FROM "_NatureTours" WHERE "A" = ${tourId}`;
      await tx.$executeRaw`DELETE FROM "_TourServices" WHERE "A" = ${tourId}`;
      await tx.$executeRaw`DELETE FROM "_HotelTours" WHERE "A" = ${tourId}`;

      // Delete the tour itself
      return await tx.tour.delete({
        where: { id: tourId },
      });
    });

    return { success: true, data: deletedTour };
  } catch (error) {
    console.error("Error deleting tour:", error);
    return { success: false, error: "Failed to delete tour" };
  }
}



export async function getTourById(tourId: string) {
  try {
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
      include: {
        destinations: true,
        categories: true,
        natures: true,
        services: true,
        hotels: true,
        programs: true,
        images: true,
        dates: true,
      },
    });

    if (!tour) {
      return { success: false, error: "Tour not found" };
    }

    return { success: true, data: tour };
  } catch (error) {
    console.error("Error fetching tour by ID:", error);
    return { success: false, error: "Failed to fetch tour" };
  }
}

export async function updateTour(tourId: string, formData: TourFormData) {
  if (!tourId) {
    return { success: false, error: "Tour ID is required" };
  }

  console.log("Updating tour with ID:", tourId);

  try {
    // 1. Fetch the existing tour to get current images and imageUrl
    const existingTour = await prisma.tour.findUnique({
      where: { id: tourId },
      include: { images: true },
    });

    if (!existingTour) {
      return { success: false, error: "Tour not found" };
    }

    // 2. Validate and parse the incoming form data
    const validatedData = tourSchema.parse(formData);

    // 3. Handle image uploads: if no images, keep old ones
    let uploadedImages = existingTour.images; // Default to keep old images if no new ones are provided
    let newImages: { url: string }[] = [];

    if (validatedData.images && validatedData.images.length > 0) {
      // Upload new images if provided
      newImages = await Promise.all(
        validatedData.images.map(async (image) => ({
          url: image.link ? await uploadImage(image.link) : "",
        }))
      );
    }

    // 4. Handle main imageUrl: upload new one only if provided
    let mainImageUrl = existingTour.imageUrl;

    if (validatedData.imageURL) {
      // Upload and update if a new main image is provided
      mainImageUrl = await uploadImage(validatedData.imageURL);
    }

    // 5. Handle program images: upload new ones if provided, otherwise keep old
    const uploadedPrograms = validatedData.programs
      ? await Promise.all(
          validatedData.programs.map(async (program) => {
            let imageUrl = "";

            // If the program has a new image file, upload it
            if (program.image instanceof File) {
              imageUrl = await uploadImage(program.image);
            } else if (typeof program.image === "string") {
              imageUrl = program.image; // Otherwise, keep existing image URL
            }

            return {
              id: program.id,
              title: program.title,
              description: program.description,
              imageUrl,
            };
          })
        )
      : [];

    // 6. Update the tour in the database with the validated data and uploaded images
    const updatedTour = await prisma.tour.update({
      where: { id: tourId },
      data: {
        active: validatedData.active ?? true, // Default to true if not provided
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type as TravelType,
        priceOriginal: validatedData.priceOriginal,
        priceDiscounted: validatedData.priceDiscounted,
        discountEndDate: validatedData.discountEndDate,
        advancedPrice: validatedData.advancedPrice,
        dateCard: validatedData.dateCard,
        durationDays: validatedData.durationDays,
        durationNights: validatedData.durationNights,
        googleMapsUrl: validatedData.googleMapsUrl
          ? (await getEmbedGoogleMapsUrl(validatedData.googleMapsUrl)) ?? ""
          : "",
        videoUrl: validatedData.videoUrl
          ? (await getYouTubeEmbedUrl(validatedData.videoUrl)) || ""
          : "", // Convert YouTube URL to embed format
        imageUrl: mainImageUrl, // Use the new or old image URL
        inclus: validatedData.inclus,
        exclus: validatedData.exclus,
        groupType: validatedData.groupType,
        groupSizeMax: validatedData.groupSizeMax,
        showReviews: validatedData.showReviews,
        showDifficulty: validatedData.showDifficulty,
        showDiscount: validatedData.showDiscount,
        difficultyLevel: validatedData.difficultyLevel,
        discountPercent: validatedData.discountPercent,
        accommodationType: validatedData.accommodationType,

        // One-to-many relation updates
        dates: validatedData.dates
          ? {
              deleteMany: {},
              create: validatedData.dates.map((d) => ({
                startDate: d.startDate,
                endDate: d.endDate,
                description: d.description,
              })),
            }
          : undefined,

        destinations: validatedData.destinations
          ? {
              set: [],
              connect: validatedData.destinations.map((id) => ({ id })),
            }
          : undefined,

        categories: validatedData.categories
          ? {
              set: [],
              connect: validatedData.categories.map((id) => ({ id })),
            }
          : undefined,

        natures: validatedData.natures
          ? {
              set: [],
              connect: validatedData.natures.map((id) => ({ id })),
            }
          : undefined,

        services: validatedData.services
          ? {
              set: [],
              connect: validatedData.services.map((id) => ({ id })),
            }
          : undefined,
        hotels: validatedData.hotels
          ? {
              set: [],
              connect: validatedData.hotels.map((id) => ({ id })),
            }
          : undefined,
 
        images: validatedData.images
          ? {
              deleteMany: {},
              create: newImages,
            }
          : undefined,

        // Update programs only if they exist
       programs: validatedData.programs
  ? {
      deleteMany: {},
      create: await Promise.all(
        validatedData.programs.map(async (program) => {
          let imageUrl = "";

          if (program.image instanceof File) {
            imageUrl = await uploadImage(program.image);
          } else if (typeof program.image === "string" && program.image !== "") {
            imageUrl = program.image;
          } else {
            // Get the existing image from the DB if ID is present
            const oldProgram = await prisma.program.findUnique({ where: { id: program.id } });
            imageUrl = oldProgram?.imageUrl || "";
          }

          return {
            title: program.title,
            description: program.description,
            imageUrl,
          };
        })
      )
    }
  : undefined,

      },
    });

    return { success: true, data: updatedTour };
  } catch (error) {
    console.error("Error updating tour:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation error",
        details: error.errors,
      };
    }
    return {
      success: false,
      error: "Failed to update tour",
    };
  }
}
