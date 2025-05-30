"use server"

import { PrismaClient, type TravelType } from "@prisma/client"
import { z } from "zod"
import { getFileUrl, uploadFile } from "@/lib/cloudeFlare";
import sharp from "sharp";




const prisma = new PrismaClient()

// Schema for validating tour data

const tourSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise").optional(),
  type: z.enum(["NATIONAL", "INTERNATIONAL"]),
  priceOriginal: z.preprocess((val) => val === "" ? undefined : typeof val === "string" ? Number(val) : val, z.number().min(0, "Le prix doit être positif").optional()),
  priceDiscounted: z.preprocess((val) => val === "" ? undefined : typeof val === "string" ? Number(val) : val, z.number().min(0, "Le prix doit être positif").optional()),
  dateCard: z.string().optional(),
  durationDays: z.preprocess((val) => val === "" ? undefined : typeof val === "string" ? Number(val) : val, z.number().min(1, "Au moins 1 jour").optional()),
  durationNights: z.preprocess((val) => val === "" ? undefined : typeof val === "string" ? Number(val) : val, z.number().min(0, "Nuits >= 0").optional()),
  imageURL: z.instanceof(File).optional().or(z.literal("")).transform(val => val === "" ? undefined : val),
  groupType: z.string().optional(),
  groupSizeMax: z.preprocess((val) => val === "" ? undefined : typeof val === "string" ? Number(val) : val, z.number().min(1, "Taille min 1").optional()),
  showReviews: z.boolean().default(true),
  showDifficulty: z.boolean().default(true),
  showDiscount: z.boolean().default(true),
  difficultyLevel: z.number().min(1).max(5).optional().or(z.literal("")).transform(val => val === "" ? undefined : val),
  discountPercent: z.preprocess(val => val === "" ? undefined : typeof val === "string" ? Number(val) : val, z.number().min(0).max(100).optional()),
  weekendsOnly: z.boolean().default(false),
  accommodationType: z.string().optional(),
  googleMapsLink: z.string().url("Lien Google Maps invalide").optional().or(z.literal("")),
  programs: z
  .array(
    z.object({
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


    async function uploadImage(imageURL: File): Promise<string> {
     
      const image = imageURL ;
      const quality = 80;

      // Step 1: Generate unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `${timestamp}-${image.name}`;

      // Step 2: Read and compress the image with sharp
      const arrayBuffer = await image.arrayBuffer();
      const compressedBuffer = await sharp(arrayBuffer)
        .resize(1200) // Resize width to 1200px, keeping aspect ratio
        .jpeg({ quality }) // or .png({ compressionLevel: 9 }) if needed
        .toBuffer();

      // Step 3: Upload the file
      const fileContent = Buffer.from(compressedBuffer);
      const uploadResponse = await uploadFile(fileContent, filename, image.type);

      // Step 4: Return the public URL
      const imageUrl = getFileUrl(uploadResponse.Key); // Key is usually the filename or path
      return (imageUrl);
    }


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
      priceOriginal: validatedData.priceOriginal,
      priceDiscounted: validatedData.priceDiscounted,
      dateCard: validatedData.dateCard,
      durationDays: validatedData.durationDays,
      durationNights: validatedData.durationNights,
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
