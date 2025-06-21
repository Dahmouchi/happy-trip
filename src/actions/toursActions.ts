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
import { updateProgram } from "./programsActions";
import { id } from "zod/v4/locales";


const prisma = new PrismaClient()

// Schema for validating tour data

const tourSchema = z.object({
  id: z.string(),
  active: z.boolean().default(true),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  type: z.enum(["NATIONAL", "INTERNATIONAL"]),
  priceOriginal: z.preprocess(
    (val) =>
      val === "" ? undefined : typeof val === "string" ? Number(val) : val,
    z.number().min(0, "Le prix doit être positif"),
  ),
  priceDiscounted: z.preprocess(
    (val) =>
      val === "" ? undefined : typeof val === "string" ? Number(val) : val,
    z.number().min(0, "Le prix doit être positif").optional()
  ),
  discountEndDate: z
    .date()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  advancedPrice: z.preprocess(
    (val) =>
      val === "" ? undefined : typeof val === "string" ? Number(val) : val,
    z.number().min(0, "Le prix doit être positif").optional()
  ),
  dateCard: z.string(),
  durationDays: z.preprocess(
    (val) =>
      val === "" ? undefined : typeof val === "string" ? Number(val) : val,
    z.number().min(1, "Au moins 1 jour"),
  ),
  durationNights: z.preprocess(
    (val) =>
      val === "" ? undefined : typeof val === "string" ? Number(val) : val,
    z.number().min(0, "Nuits >= 0"),
  ),
  videoUrl: z
    .string()
    .url("URL de la vidéo invalide")
    .optional()
    .or(z.literal("")),
  imageURL: z
    .instanceof(File)
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  groupType: z.string(),
  groupSizeMax: z.preprocess(
    (val) =>
      val === "" ? undefined : typeof val === "string" ? Number(val) : val,
    z.number().min(1, "Taille min 1")
  ),
  showReviews: z.boolean().default(true),
  showDifficulty: z.boolean().default(true),
  showDiscount: z.boolean().default(true),
  difficultyLevel: z
    .number()
    .min(1)
    .max(5)
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  discountPercent: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  accommodationType: z.string(),
  googleMapsUrl: z
    .string()
    .url("Lien Google Maps invalide")
    .optional()
    .or(z.literal("")),
  programs: z
    .array(
      z.object({
        title: z.string().min(1, "Titre requis"),
        description: z.string(),
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

  dates: z
    .array(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        description: z.string().optional(),
        visible: z.boolean().default(true),
      })
    )
    .optional(),
  images: z.array(
    z.object({
      link: z
        .instanceof(File)
        .or(z.literal(""))
        .transform((val) => (val === "" ? undefined : val)),
    })
  ),

  destinations: z.array(z.string()),
  categories: z.array(z.string()),
  services: z.array(z.string()),
  natures: z.array(z.string()),
  hotels: z.array(z.string()).optional(),
  inclus: z.string(),
  exclus: z.string(),
  arrayInclus: z.array(z.string()),
  arrayExlus: z.array(z.string()),
});

export type TourFormData = z.infer<typeof tourSchema>
 
  function getCorrectId(id:string)
  {
    return id.replace(/\s+/g, "-");
  }
 

  export async function addTour(formData: TourFormData) {
  try {
    // Validate the form data
    const validatedData = tourSchema.parse(formData)
    
    console.log(validatedData)
    // Create the tour in the database
  
    const tour = await prisma.tour.create({
      data: {
      id: getCorrectId(validatedData.id), // Use the provided ID
      active: validatedData.active, // Default to true if not provided
      title: validatedData.title,
      description: validatedData.description,
      type: validatedData.type as TravelType,
      priceOriginal: validatedData.priceOriginal,
      priceDiscounted: validatedData.priceDiscounted === 0 ? validatedData.priceOriginal : validatedData.priceDiscounted,
      discountEndDate: validatedData.discountEndDate ? new Date(validatedData.discountEndDate) : null,
      advancedPrice: validatedData.advancedPrice === 0 ? validatedData.priceOriginal : validatedData.advancedPrice || validatedData.priceOriginal,
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
          visible: dateObj.visible ?? true, // Default to true if not provided
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
      await tx.reservation.deleteMany({ where: { tourId } });
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

  try {
    const existingTour = await prisma.tour.findUnique({
      where: { id: tourId },
      include: { images: true, programs: true, dates: true },
    });

    if (!existingTour) {
      return { success: false, error: "Tour not found" };
    }

    const validatedData = tourSchema.parse(formData);

    const newImages = validatedData.images && validatedData.images.length > 0
      ? await Promise.all(
          validatedData.images.map(async (image) => ({
            url: image.link ? await uploadImage(image.link) : "",
          }))
        )
      : existingTour.images;

    const mainImageUrl = validatedData.imageURL
      ? await uploadImage(validatedData.imageURL)
      : existingTour.imageUrl;

    // Avoid deleting dates used by reservations
    const usedDateIds = (
      await prisma.reservation.findMany({
        where: { tourId },
        select: { travelDateId: true },
      })
    ).map((r) => r.travelDateId);

    const deletableDateIds = existingTour.dates
      .map((d) => d.id)
      .filter((id) => !usedDateIds.includes(id));

    const updatedTour = await prisma.tour.update({
      where: { id: tourId },
      data: {
        active: validatedData.active ?? true,
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type,
        priceOriginal: validatedData.priceOriginal,
      priceDiscounted: validatedData.priceDiscounted === 0 ? validatedData.priceOriginal : validatedData.priceDiscounted,
        discountEndDate: validatedData.discountEndDate,
        advancedPrice: validatedData.advancedPrice === 0 ? validatedData.priceOriginal : validatedData.advancedPrice || validatedData.priceOriginal,
        dateCard: validatedData.dateCard,
        durationDays: validatedData.durationDays,
        durationNights: validatedData.durationNights,
        googleMapsUrl: validatedData.googleMapsUrl
          ? (await getEmbedGoogleMapsUrl(validatedData.googleMapsUrl)) ?? ""
          : "",
        videoUrl: validatedData.videoUrl
          ? (await getYouTubeEmbedUrl(validatedData.videoUrl)) || ""
          : "",
        imageUrl: mainImageUrl,
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

        dates: validatedData.dates
          ? {
              deleteMany: {
                id: { in: deletableDateIds },
              },
              create: validatedData.dates.map((d) => ({
                startDate: d.startDate,
                endDate: d.endDate,
                description: d.description,
                visible: d.visible ?? true, // Default to true if not provided
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
      },
    });

    if (validatedData.programs) {
      const normalizedPrograms = validatedData.programs.map((program) => ({
        ...program,
        image: program.image === undefined ? null : program.image,
      }));
      await updateProgramsForTour(tourId, normalizedPrograms);
    }

    return { success: true, data: updatedTour };
  } catch (error) {
    console.error("Error updating tour:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Validation error", details: error.errors };
    }
    return { success: false, error: "Failed to update tour" };
  }
}

async function updateProgramsForTour(
  tourId: string,
  programs: {
    id?: string;
    title: string;
    description?: string;
    image: string | File | null;
  }[]
) {
  const existingPrograms = await prisma.program.findMany({
    where: { tourId },
    select: { id: true },
  });

  const incomingIds = programs.filter((p) => p.id).map((p) => p.id!);

  const toDelete = existingPrograms
    .filter((p) => !incomingIds.includes(p.id))
    .map((p) => p.id);

  if (toDelete.length > 0) {
    await prisma.program.deleteMany({ where: { id: { in: toDelete } } });
  }

  for (const program of programs) {
    let imageUrl = "";

    if (program.image instanceof File) {
      imageUrl = await uploadImage(program.image);
    } else if (typeof program.image === "string" && program.image !== "") {
      imageUrl = program.image;
    } else if (program.id) {
      const old = await prisma.program.findUnique({ where: { id: program.id } });
      imageUrl = old?.imageUrl || "";
    }

    if (program.id) {
      await prisma.program.update({
        where: { id: program.id },
        data: {
          title: program.title,
          description: program.description,
          imageUrl,
        },
      });
    } else {
      await prisma.program.create({
        data: {
          title: program.title,
          description: program.description,
          imageUrl,
          tourId,
        },
      });
    }
  }
}



export async function checkTourIdExists(tourId: string) {
  try {
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
    });
    return { exists: !!tour };
  } catch (error) {
    console.error("Error checking tour ID:", error);
    return { exists: false, error: "Failed to check tour ID" };
  } finally {
    await prisma.$disconnect();
  }
}
