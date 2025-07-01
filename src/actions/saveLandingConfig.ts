'use server'
import { uploadImage } from "@/utils/uploadImage";
import prisma  from '@/lib/prisma'

export async function saveLandingConfig(
  sections: Record<string, boolean>,
  cardImage: File[] | null
) {
  // Get current landing config
  const current = await prisma.landing.findFirst();

  // Upload new image if provided, else keep current
  const mainImageUrl = cardImage
    ? await uploadImage(cardImage[0])
    : current?.imageHero || '';

  if (!current) {
    // Create new landing config
    await prisma.landing.create({
      data: {
        ...sections,
        imageHero: mainImageUrl,
      },
    });
  } else {
    // Update existing landing config
    await prisma.landing.update({
      where: { id: current.id },
      data: {
        ...sections,
        imageHero: mainImageUrl,
      },
    });
  }
}


// lib/landing.ts or wherever you define helpers
import { Landing } from '@prisma/client' // Optional, if you want type support

export async function getLanding(): Promise<Landing | null> {
  try {
    const current = await prisma.landing.findFirst()
    return current
  } catch (error) {
    console.error('Error fetching landing config:', error)
    return null
  }
}
export async function GetAllNews() {
  const reviews = await prisma.newsLetter.findMany({
    orderBy: { createdAt: "desc" },
  });

  return { success: true, data: reviews };
}
export async function markAllNewsTrue() {
  const reviews = await prisma.newsLetter.updateMany({
   data:{
    statu:true
   }
  });

  return { success: true, data: reviews };
}
export async function DeleteNews(reviewId: string) {
  if (!reviewId) {
    return { success: false, error: "Review ID is required" };
  }

  const review = await prisma.newsLetter.delete({
    where: { id: reviewId },
  });

  return { success: true, data: review };
}
export async function UpdateNewsStatus(reviewId: string, statu: boolean) {
  if (!reviewId) {
    return { success: false, error: "Review ID is required" };
  }
  const review = await prisma.newsLetter.update({
    where: { id: reviewId },
    data: { statu },
  });
  
  return { success: true, data: review };
}
export async function createNewsLetter(nom:string,prenom:string,email:string,message:string) {
  // First get the current landing page config
  try{

    const res = await prisma.newsLetter.create({
      data:{
        nom,
        prenom,
        email,
        message,
      }
    })
    return res;
  } catch (error) {
    console.error("Error creating newsletter:", error);
    return { success: false, error: "Failed to create destination" };
  }
}
