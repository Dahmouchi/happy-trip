// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use server";

// import { PrismaClient, type TravelType } from "@prisma/client";

// import { getEmbedGoogleMapsUrl } from "@/utils/getEmbedGoogleMapsUrl";
// import { getYouTubeEmbedUrl } from "@/utils/getYouTubeEmbedUrl";
// import { uploadImage } from "@/utils/uploadImage";


// const prisma = new PrismaClient();

// // Schema for validating tour data

// function getCorrectId(id: string) {
//   return id
//     .normalize("NFD")
//     .replace(/œ/g, "oe") // Replace oe ligature
//     .replace(/æ/g, "ae") // Replace ae ligature
//     .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
//     .replace(/\s+/g, "-") // Optional: spaces to dashes
//     .replace(/[^a-zA-Z0-9-]/g, "") // Keep only allowed chars
//     .replace(/-+/g, "-") // Collapse multiple dashes
//     .replace(/^-|-$/g, "") // Trim leading/trailing dash
//     .toLowerCase();
// }



// export async function addTour(
//   formData: any,
//   reservationFormFields: any[],
// ) {
//   try {
//     const validatedData = formData;

//     const tour = await prisma.tour.create({
//       data: {
//         id: getCorrectId(validatedData.id),
//         active: validatedData.active,
//         title: validatedData.title,
//         reservationForm: {
//           create: {
//             fields: reservationFormFields,
//           },
//         },
//         description: validatedData.description,
//         type: validatedData.type as TravelType,
//         priceOriginal: validatedData.priceOriginal,
//         priceDiscounted:
//           validatedData.priceDiscounted === 0 ||
//           validatedData.priceDiscounted === undefined ||
//           validatedData.priceDiscounted === null
//             ? validatedData.priceOriginal
//             : validatedData.priceDiscounted,
//         discountEndDate: validatedData.discountEndDate
//           ? new Date(validatedData.discountEndDate)
//           : null,
//         advancedPrice:
//           validatedData.advancedPrice === 0
//             ? validatedData.priceOriginal
//             : validatedData.advancedPrice || validatedData.priceOriginal,
//         dateCard: validatedData.dateCard,
//         durationDays: parseInt(validatedData.durationDays),
//         durationNights: parseInt(validatedData.durationNights),
//         googleMapsUrl: validatedData.googleMapsUrl
//           ? (await getEmbedGoogleMapsUrl(validatedData.googleMapsUrl)) ?? ""
//           : "",
//         videoUrl: validatedData.videoUrl
//           ? (await getYouTubeEmbedUrl(validatedData.videoUrl)) || ""
//           : "",
//         imageUrl: validatedData.imageURL
//           ? await uploadImage(validatedData.imageURL)
//           : "",
//         inclus: validatedData.inclus,
//         exclus: validatedData.exclus,
//         extracts: validatedData.extracts,
//         groupType: validatedData.groupType,
//         groupSizeMax: parseInt(validatedData.groupSizeMax),
//         showReviews: validatedData.showReviews,
//         showHebergement: validatedData.showHebergement,
//         showDifficulty: validatedData.showDifficulty,
//         showDiscount: validatedData.showDiscount,
//         difficultyLevel: validatedData.difficultyLevel,
//         discountPercent: validatedData.discountPercent,
//         accommodationType: validatedData.accommodationType,

//         dates: validatedData.dates
//           ? {
//               create: validatedData.dates.map((dateObj:any) => ({
//                 startDate: dateObj.startDate,
//                 endDate: dateObj.endDate,
//                 description: dateObj.description,
//                 price: dateObj.price ?? 0,
//                 visible: dateObj.visible ?? true,
//               })),
//             }
//           : undefined,

//         hotels: validatedData.hotels
//           ? {
//               connect: validatedData.hotels.map((id:any) => ({ id })),
//             }
//           : undefined,

//         services: validatedData.services
//           ? {
//               connect: validatedData.services.map((id:any) => ({ id })),
//             }
//           : undefined,

//         destinations: validatedData.destinations
//           ? {
//               connect: validatedData.destinations.map((id:any) => ({ id })),
//             }
//           : undefined,

//         categories: validatedData.categories
//           ? {
//               connect: validatedData.categories.map((id:any) => ({ id })),
//             }
//           : undefined,

//         natures: validatedData.natures
//           ? {
//               connect: validatedData.natures.map((id:any) => ({ id })),
//             }
//           : undefined,

//         images: validatedData.images
//           ? {
//               create: await Promise.all(
//                 validatedData.images.map(async (image:any) => ({
//                   url: image.link ? await uploadImage(image.link) : "",
//                 }))
//               ),
//             }
//           : undefined,

//         programs: validatedData.programs
//           ? {
//               create: await Promise.all(
//                 validatedData.programs.map(async (program:any) => {
//                   let imageUrl = "";

//                   if (program.image instanceof File) {
//                     imageUrl = await uploadImage(program.image);
//                   } else if (typeof program.image === "string") {
//                     imageUrl = program.image;
//                   }

//                   return {
//                     title: program.title,
//                     orderIndex: program.orderIndex,
//                     description: program.description,
//                     imageUrl,
//                   };
//                 })
//               ),
//             }
//           : undefined,
//       },
//     });

//     return { success: true, data: tour };
//   }  catch (error) {
//   console.error("Prisma error:", error);

//   return {
//     success: false,
//     error: {
//       message: error instanceof Error ? error.message : "Unknown error",
//       code: (error as any).code ?? null,
//       meta: (error as any).meta ?? null,
//       stack: (error as any).stack ?? null,
//     },
//   };
// }

// }



// export async function getAllTours() {
//   try {
//     const tours = await prisma.tour.findMany({
//       include: {
//         destinations: true,
//         categories: true,
//         natures: true,
//         programs: true,
//         images: true,
//       },
//       orderBy:{
//         updatedAt:"desc",
//       }
//     });
//     return { success: true, data: tours };
//   } catch (error) {
//     console.error("Error fetching tours:", error);
//     return { success: false, error: "Failed to fetch tours" };
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// export async function deleteTour(tourId: string) {
//   try {
//     const deletedTour = await prisma.$transaction(async (tx) => {
//       // Delete dependent child records (one-to-many)
//       await tx.reservations.deleteMany({ where: { tourId } });
//       await tx.tourDate.deleteMany({ where: { tourId } });
//       await tx.program.deleteMany({ where: { tourId } });
//       await tx.file.deleteMany({ where: { tourId } }); // only works if relation is one-to-many

//       // Delete join table entries (many-to-many)
//       await tx.$executeRaw`DELETE FROM "_TourDestinations" WHERE "A" = ${tourId}`;
//       await tx.$executeRaw`DELETE FROM "_CategoryTours" WHERE "A" = ${tourId}`;
//       await tx.$executeRaw`DELETE FROM "_NatureTours" WHERE "A" = ${tourId}`;
//       await tx.$executeRaw`DELETE FROM "_TourServices" WHERE "A" = ${tourId}`;
//       await tx.$executeRaw`DELETE FROM "_HotelTours" WHERE "A" = ${tourId}`;

//       // Delete the tour itself
//       return await tx.tour.delete({
//         where: { id: tourId },
//       });
//     });

//     return { success: true, data: deletedTour };
//   } catch (error) {
//     console.error("Error deleting tour:", error);
//     return { success: false, error: "Failed to delete tour" };
//   }
// }

// export async function getTourById(tourId: string) {
//   try {
//     const tour = await prisma.tour.findUnique({
//       where: { id: tourId },
//       include: {
//         destinations: true,
//         categories: true,
//         natures: true,
//         services: true,
//         hotels: true,
//         programs: true,
//         images: true,
//         reservationForm:true,
//         dates: true,
//       },
//     });

//     if (!tour) {
//       return { success: false, error: "Tour not found" };
//     }

//     return { success: true, data: tour };
//   } catch (error) {
//     console.error("Error fetching tour by ID:", error);
//     return { success: false, error: "Failed to fetch tour" };
//   }
// }

// export async function updateTour(tourId: string, formData: any) {
//   // console.log("prodrams", formData.programs);
//   if (!tourId) {
//     return { success: false, error: "Tour ID is required" };
//   }

//   try {
//     const existingTour = await prisma.tour.findUnique({
//       where: { id: tourId },
//       include: { images: true, programs: true, dates: true },
//     });

//     if (!existingTour) {
//       return { success: false, error: "Tour not found" };
//     }

//     const validatedData = formData;

//     let newImages: { url: string }[] | undefined;

//     if (validatedData.images && validatedData.images.length > 0) {
//       newImages = await Promise.all(
//         validatedData.images.map(async (image:any) => ({
//           url: image.link ? await uploadImage(image.link) : "",
//         }))
//       );
//     } else if (validatedData.images) {
//       newImages = [];
//     } else {
//       newImages = undefined;
//     }

//     const mainImageUrl = validatedData.imageURL
//       ? await uploadImage(validatedData.imageURL)
//       : existingTour.imageUrl;

//     // Avoid deleting dates used by reservations
//     const usedDateIds = (
//       await prisma.reservations.findMany({
//         where: { tourId },
//         select: { travelDateId: true },
//       })
//     ).map((r) => r.travelDateId);

//     const deletableDateIds = existingTour.dates
//       .map((d) => d.id)
//       .filter((id) => !usedDateIds.includes(id));

//     const updatedTour = await prisma.tour.update({
//       where: { id: tourId },
//       data: {
//         active: validatedData.active ?? true,
//         title: validatedData.title,
//         description: validatedData.description,
//         type: validatedData.type,
//         priceOriginal: validatedData.priceOriginal,
//         priceDiscounted:
//           validatedData.priceDiscounted === 0 || validatedData.priceDiscounted === undefined || validatedData.priceDiscounted === null
//             ? validatedData.priceOriginal
//             : validatedData.priceDiscounted,
//         discountEndDate: validatedData.discountEndDate
//           ? new Date(validatedData.discountEndDate)
//           : null,
//         advancedPrice:
//           validatedData.advancedPrice === 0
//             ? validatedData.priceOriginal
//             : validatedData.advancedPrice || validatedData.priceOriginal,
//         dateCard: validatedData.dateCard,
//         durationDays:  parseInt(validatedData.durationDays),
//         durationNights:  parseInt(validatedData.durationNights),
//         googleMapsUrl: validatedData.googleMapsUrl
//           ? (await getEmbedGoogleMapsUrl(validatedData.googleMapsUrl)) ?? ""
//           : "",
//         videoUrl: validatedData.videoUrl
//           ? (await getYouTubeEmbedUrl(validatedData.videoUrl)) || ""
//           : "",
//         imageUrl: mainImageUrl,
//         inclus: validatedData.inclus,
//         exclus: validatedData.exclus,
//         extracts: validatedData.extracts,
//         groupType: validatedData.groupType,
//         groupSizeMax:  parseInt(validatedData.groupSizeMax),
//         showReviews: validatedData.showReviews,
//         showHebergement: validatedData.showHebergement,
//         showDifficulty: validatedData.showDifficulty,
//         showDiscount: validatedData.showDiscount,
//         difficultyLevel: validatedData.difficultyLevel,
//         discountPercent: validatedData.discountPercent,
//         accommodationType: validatedData.accommodationType,

//         dates: validatedData.dates
//           ? {
//               deleteMany: {
//                 id: { in: deletableDateIds },
//               },
//               create: validatedData.dates.map((d:any) => ({
//                 startDate: d.startDate,
//                 endDate: d.endDate,
//                 description: d.description,
//                 price: d.price ?? 0,
//                 visible: d.visible ?? true, // Default to true if not provided
//               })),
//             }
//           : undefined,

//         destinations: validatedData.destinations
//           ? {
//               set: [],
//               connect: validatedData.destinations.map((id:any) => ({ id })),
//             }
//           : undefined,

//         categories: validatedData.categories
//           ? {
//               set: [],
//               connect: validatedData.categories.map((id:any) => ({ id })),
//             }
//           : undefined,

//         natures: validatedData.natures
//           ? {
//               set: [],
//               connect: validatedData.natures.map((id:any) => ({ id })),
//             }
//           : undefined,

//         services: validatedData.services
//           ? {
//               set: [],
//               connect: validatedData.services.map((id:any) => ({ id })),
//             }
//           : undefined,

//         hotels: validatedData.hotels
//           ? {
//               set: [],
//               connect: validatedData.hotels.map((id:any) => ({ id })),
//             }
//           : undefined,

//         images: validatedData.images
//           ? {
//               deleteMany: {},
//               create: newImages,
//             }
//           : undefined,
//       },
//     });

//     if (validatedData.programs) {
//       const normalizedPrograms = validatedData.programs.map((program:any) => ({
//         ...program,
//         image: program.image === undefined ? null : program.image,
//       }));
//       await updateProgramsForTour(tourId, normalizedPrograms);
//     }

//     return { success: true, data: updatedTour };
//   }  catch (error) {
//     console.error("Prisma error:", error);

//     return {
//       success: false,
//       error: {
//         message: error instanceof Error ? error.message : "Unknown error",
//         code: (error as any).code ?? null,
//         meta: (error as any).meta ?? null,
//         stack: (error as any).stack ?? null,
//       },
//     };
//   }
// }

// async function updateProgramsForTour(
//   tourId: string,
//   programs: {
//     id?: string;
//     title: string;
//     description?: string;
//     image: string | File | null;
//   }[]
// ) {
//   const existingPrograms = await prisma.program.findMany({
//     where: { tourId },
//     select: { id: true },
//   });

//   const incomingIds = programs.filter((p) => p.id).map((p) => p.id!);

//   const toDelete = existingPrograms
//     .filter((p) => !incomingIds.includes(p.id))
//     .map((p) => p.id);

//   if (toDelete.length > 0) {
//     await prisma.program.deleteMany({ where: { id: { in: toDelete } } });
//   }

//   for (const program of programs) {
//     let imageUrl = "";

//     if (program.image instanceof File) {
//       imageUrl = await uploadImage(program.image);
//     } else if (typeof program.image === "string" && program.image !== "") {
//       imageUrl = program.image;
//     } else if (program.id) {
//       const old = await prisma.program.findUnique({
//         where: { id: program.id },
//       });
//       imageUrl = old?.imageUrl || "";
//     }

//     if (program.id) {
//       await prisma.program.update({
//         where: { id: program.id },
//         data: {
//           title: program.title,
//           description: program.description,
//           imageUrl,
//         },
//       });
//     } else {
//       await prisma.program.create({
//         data: {
//           title: program.title,
//           description: program.description,
//           imageUrl,
//           tourId,
//         },
//       });
//     }
//   }
// }

// export async function checkTourIdExists(tourId: string) {
//   try {
//     const tour = await prisma.tour.findUnique({
//       where: { id: tourId },
//     });
//     return { exists: !!tour };
//   } catch (error) {
//     console.error("Error checking tour ID:", error);
//     return { exists: false, error: "Failed to check tour ID" };
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// export async function updateReservationTour(reservationId: string,updatedFields:any) {
//   try {
//     const tour = await prisma.reservationForm.findUnique({
//       where: { id: reservationId },
//     });
//     if(tour){
//        const res = await prisma.reservationForm.update({
//         where: { id: reservationId },
//         data: {
//           fields:updatedFields
//         },
//       });
//        return { success: true ,  data: res };
//     }
   
//   } catch (error) {
//     console.error("Error checking tour ID:", error);
//     return { exists: false, error: "Failed to check tour ID" };
//   } finally {
//     await prisma.$disconnect();
//   }
// }



/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { PrismaClient, type TravelType } from "@prisma/client";
import { getEmbedGoogleMapsUrl } from "@/utils/getEmbedGoogleMapsUrl";
import { getYouTubeEmbedUrl } from "@/utils/getYouTubeEmbedUrl";
import sharp from "sharp";
import { getFileUrl, uploadFile } from "@/lib/cloudeFlare";

async function uploadImage(imageURL: File): Promise<string> {
  const image = imageURL;
  const quality = 80;

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${timestamp}-${image.name}`;

  const arrayBuffer = await image.arrayBuffer();
  const compressedBuffer = await sharp(arrayBuffer)
    .resize(1200)
    .jpeg({ quality })
    .toBuffer();

  const fileContent = Buffer.from(compressedBuffer);
  await uploadFile(fileContent, filename, image.type);

  return getFileUrl(filename);
}

const prisma = new PrismaClient();

function getCorrectId(id: string) {
  return id
    .normalize("NFD")
    .replace(/œ/g, "oe") // Replace oe ligature
    .replace(/æ/g, "ae") // Replace ae ligature
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/\s+/g, "-") // Optional: spaces to dashes
    .replace(/[^a-zA-Z0-9-]/g, "") // Keep only allowed chars
    .replace(/-+/g, "-") // Collapse multiple dashes
    .replace(/^-|-$/g, "") // Trim leading/trailing dash
    .toLowerCase();
}


export async function addTour(
  formData: any,
  reservationFormFields: any[],
  
) {
  try {
    const validatedData = formData;

    let imgUrl = "";
    if (validatedData.imageURL) {
      imgUrl = await uploadImage(validatedData.imageURL);
    }

    // if (validatedData.programs && Array.isArray(validatedData.programs)) {
    //   validatedData.programs = await Promise.all(
    //     validatedData.programs.map(async (program: any) => {
    //       let imageUrl = "";
    //       if (program.image instanceof File) {
    //         imageUrl = await uploadImage(program.image);
    //       } else if (typeof program.image === "string" && program.image !== "") {
    //         imageUrl = await uploadImage(program.image);
    //       }
    //       return {
    //         ...program,
    //         image: imageUrl,
    //       };
    //     })
    //   );
    // }

    const tour = await prisma.tour.create({
      data: {
      id: getCorrectId(validatedData.id),
      active: validatedData.active,
      title: validatedData.title,
      reservationForm: {
        create: {
        fields: reservationFormFields,
        },
      },
      description: validatedData.description,
      type: validatedData.type as TravelType,
      priceOriginal: validatedData.priceOriginal,
      priceDiscounted:
        validatedData.priceDiscounted === 0 ||
        validatedData.priceDiscounted === undefined ||
        validatedData.priceDiscounted === null
        ? validatedData.priceOriginal
        : validatedData.priceDiscounted,
      discountEndDate: validatedData.discountEndDate
        ? new Date(validatedData.discountEndDate)
        : null,
      advancedPrice:
        validatedData.advancedPrice === 0
        ? validatedData.priceOriginal
        : validatedData.advancedPrice || validatedData.priceOriginal,
      dateCard: validatedData.dateCard,
      durationDays: parseInt(validatedData.durationDays),
      durationNights: parseInt(validatedData.durationNights),
      googleMapsUrl: validatedData.googleMapsUrl
        ? (await getEmbedGoogleMapsUrl(validatedData.googleMapsUrl)) ?? ""
        : "",
      videoUrl: validatedData.videoUrl
        ? (await getYouTubeEmbedUrl(validatedData.videoUrl)) || ""
        : "",
      imageUrl: imgUrl,
      inclus: validatedData.inclus,
      exclus: validatedData.exclus,
      extracts: validatedData.extracts,
      groupType: validatedData.groupType,
      groupSizeMax: parseInt(validatedData.groupSizeMax),
      showReviews: validatedData.showReviews,
      showHebergement: validatedData.showHebergement,
      showDifficulty: validatedData.showDifficulty,
      showDiscount: validatedData.showDiscount,
      difficultyLevel: validatedData.difficultyLevel,
      discountPercent: validatedData.discountPercent,
      accommodationType: validatedData.accommodationType,

      dates: validatedData.dates
        ? {
          create: validatedData.dates.map((dateObj:any) => ({
          startDate: dateObj.startDate,
          endDate: dateObj.endDate,
          description: dateObj.description,
          price: dateObj.price ?? 0,
          visible: dateObj.visible ?? true,
          })),
        }
        : undefined,

      hotels: validatedData.hotels
        ? {
          connect: validatedData.hotels.map((id:any) => ({ id })),
        }
        : undefined,

      services: validatedData.services
        ? {
          connect: validatedData.services.map((id:any) => ({ id })),
        }
        : undefined,

      destinations: validatedData.destinations
        ? {
          connect: validatedData.destinations.map((id:any) => ({ id })),
        }
        : undefined,

      categories: validatedData.categories
        ? {
          connect: validatedData.categories.map((id:any) => ({ id })),
        }
        : undefined,

      natures: validatedData.natures
        ? {
          connect: validatedData.natures.map((id:any) => ({ id })),
        }
        : undefined,

      images: validatedData.images
        ? {
          create: await Promise.all(
          validatedData.images.map(async (image:any) => ({
            url: image.link ? await uploadImage(image.link) : "",
          }))
          ),
        }
        : undefined,

      programs: validatedData.programs
        ? {
          create: validatedData.programs.map((program:any) => ({
          title: program.title,
          orderIndex: program.orderIndex,
          description: program.description,
          })),
        }
        : undefined,
      },
    });

    return { success: true, data: tour };
  }  catch (error) {
  console.error("Prisma error:", error);

  return {
    success: false,
    error: {
      message: error instanceof Error ? error.message : "Unknown error",
      code: (error as any).code ?? null,
      meta: (error as any).meta ?? null,
      stack: (error as any).stack ?? null,
    },
  };
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
      orderBy:{
        updatedAt:"desc",
      }
    });
    return { success: true, data: tours };
  } catch (error) {
    console.error("Error fetching tours:", error);
    return { success: false, error: "Failed to fetch tours" };
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteTour(tourId: string) {
  try {
    const deletedTour = await prisma.$transaction(async (tx) => {
      // Delete dependent child records (one-to-many)
      await tx.reservations.deleteMany({ where: { tourId } });
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
        reservationForm:true,
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

export async function updateTour(tourId: string, formData: any) {
  // console.log("prodrams", formData.programs);
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

    const validatedData = formData;

    let newImages: { url: string }[] | undefined;

    if (validatedData.images && validatedData.images.length > 0) {
      newImages = await Promise.all(
        validatedData.images.map(async (image:any) => ({
          url: image.link ? await uploadImage(image.link) : "",
        }))
      );
    } else if (validatedData.images) {
      newImages = [];
    } else {
      newImages = undefined;
    }

    const mainImageUrl = validatedData.imageURL
      ? await uploadImage(validatedData.imageURL)
      : existingTour.imageUrl;

    // Avoid deleting dates used by reservations
    const usedDateIds = (
      await prisma.reservations.findMany({
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
        priceDiscounted:
          validatedData.priceDiscounted === 0 || validatedData.priceDiscounted === undefined || validatedData.priceDiscounted === null
            ? validatedData.priceOriginal
            : validatedData.priceDiscounted,
        discountEndDate: validatedData.discountEndDate
          ? new Date(validatedData.discountEndDate)
          : null,
        advancedPrice:
          validatedData.advancedPrice === 0
            ? validatedData.priceOriginal
            : validatedData.advancedPrice || validatedData.priceOriginal,
        dateCard: validatedData.dateCard,
        durationDays:  parseInt(validatedData.durationDays),
        durationNights:  parseInt(validatedData.durationNights),
        googleMapsUrl: validatedData.googleMapsUrl
          ? (await getEmbedGoogleMapsUrl(validatedData.googleMapsUrl)) ?? ""
          : "",
        videoUrl: validatedData.videoUrl
          ? (await getYouTubeEmbedUrl(validatedData.videoUrl)) || ""
          : "",
        imageUrl: mainImageUrl,
        inclus: validatedData.inclus,
        exclus: validatedData.exclus,
        extracts: validatedData.extracts,
        groupType: validatedData.groupType,
        groupSizeMax:  parseInt(validatedData.groupSizeMax),
        showReviews: validatedData.showReviews,
        showHebergement: validatedData.showHebergement,
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
              create: validatedData.dates.map((d:any) => ({
                startDate: d.startDate,
                endDate: d.endDate,
                description: d.description,
                price: d.price ?? 0,
                visible: d.visible ?? true, // Default to true if not provided
              })),
            }
          : undefined,

        destinations: validatedData.destinations
          ? {
              set: [],
              connect: validatedData.destinations.map((id:any) => ({ id })),
            }
          : undefined,

        categories: validatedData.categories
          ? {
              set: [],
              connect: validatedData.categories.map((id:any) => ({ id })),
            }
          : undefined,

        natures: validatedData.natures
          ? {
              set: [],
              connect: validatedData.natures.map((id:any) => ({ id })),
            }
          : undefined,

        services: validatedData.services
          ? {
              set: [],
              connect: validatedData.services.map((id:any) => ({ id })),
            }
          : undefined,

        hotels: validatedData.hotels
          ? {
              set: [],
              connect: validatedData.hotels.map((id:any) => ({ id })),
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
      const normalizedPrograms = validatedData.programs.map((program:any) => ({
        ...program,
      }));
      await updateProgramsForTour(tourId, normalizedPrograms);
    }

    return { success: true, data: updatedTour };
  }  catch (error) {
    console.error("Prisma error:", error);

    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
        code: (error as any).code ?? null,
        meta: (error as any).meta ?? null,
        stack: (error as any).stack ?? null,
      },
    };
  }
}

async function updateProgramsForTour(
  tourId: string,
  programs: {
    id?: string;
    title: string;
    description?: string;
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

    if (program.id) {
      await prisma.program.update({
        where: { id: program.id },
        data: {
          title: program.title,
          description: program.description,
        },
      });
    } else {
      await prisma.program.create({
        data: {
          title: program.title,
          description: program.description,
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

export async function updateReservationTour(reservationId: string,updatedFields:any) {
  try {
    const tour = await prisma.reservationForm.findUnique({
      where: { id: reservationId },
    });
    if(tour){
       const res = await prisma.reservationForm.update({
        where: { id: reservationId },
        data: {
          fields:updatedFields
        },
      });
       return { success: true ,  data: res };
    }
   
  } catch (error) {
    console.error("Error checking tour ID:", error);
    return { exists: false, error: "Failed to check tour ID" };
  } finally {
    await prisma.$disconnect();
  }
}
