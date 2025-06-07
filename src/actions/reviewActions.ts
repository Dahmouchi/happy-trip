/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()



export async function AddReview(fullName: string,message:string,rating:number) {
    if (!fullName || !message || !rating) {
    return { success: false, error: "Failed to delete tour" };
  }

 {/*  const review = await prisma.reviews.create({
    data: {
      fullName,
      message,
      rating: Number(rating),
    },
  });*/}
    
}
