/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()



export async function AddReview(fullName: string,message:string,rating:number,tourId:string) {
    if (!fullName || !message || !rating) {
    return { success: false, error: "Failed to delete tour" };
  }

  const review = await prisma.review.create({
    data: {
      tourId,
      fullName,
      message,
      rating: Number(rating),
    },
  });
   return { success: true, data: review };
    
}
