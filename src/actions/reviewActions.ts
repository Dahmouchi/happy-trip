"use server"

import { PrismaClient, Review } from "@prisma/client"

const prisma = new PrismaClient()



export async function AddReview(fullName: string,message:string,rating:number,tourId:string) {
    if (!fullName || !message || !rating) {
    return { success: false, error: "Failed to add review" };
  }

  const review = await prisma.review.create({
    data: {
      tourId,
      fullName,
      message,
      rating: Number(rating),
      status: false
    },
  });
   return { success: true, data: review };
    
}


export async function GetReviewsByTourId(tourId: string) {
  if (!tourId) {
    return {success:false, error: "Tour ID is required"};
  }
  const reviews = await prisma.review.findMany({
    where: {tourId},
    orderBy: { createdAt: "desc" },
  })
  return { success: true, data: reviews };
}

export async function GetAllReviews() {
  const reviews = await prisma.review.findMany({
    include: {
      tour: {
        select: { title: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const enrichedReviews = reviews.map((review) => ({
    ...review,
    tourTitle: review.tour?.title || "Tour inconnu",
  }));

  return { success: true, data: enrichedReviews };
}


export async function DeleteReview(reviewId: string) {
  if (!reviewId) {
    return { success: false, error: "Review ID is required" };
  }

  const review = await prisma.review.delete({
    where: { id: reviewId },
  });

  return { success: true, data: review };
}

export async function UpdateReview(reviewId:string, data:Review)
{
  if (!reviewId)
  {
    return { success: false, error: "Review ID is required" };
  }
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: {
      fullName: data.fullName,
      message: data.message,
      rating: Number(data.rating),
      status: data.status
    },
  });
  return { success: true, data: review };
}

export async function UpdateReviewStatus(reviewId: string, status: boolean) {
  if (!reviewId) {
    return { success: false, error: "Review ID is required" };
  }

  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { status },
  });

  return { success: true, data: review };
}