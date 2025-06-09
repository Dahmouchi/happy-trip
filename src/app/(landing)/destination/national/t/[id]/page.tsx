/* eslint-disable @typescript-eslint/no-explicit-any */
// app/tours/[id]/page.tsx (or similar path)
export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import React from "react";
import { Tour } from "@prisma/client";
import TourDetails from "@/app/(landing)/_components/ProductDetails";



const TourDetailsMain = async (params:any) => {
 const tour: Tour | null = await prisma.tour.findUnique({
    where: {
      id:params.params.id,
    },
    include:{
        dates:true,
        images:true,
        natures:true,
        destinations:true,
        programs:true,
        categories:true,
        reviews:true,
        services:true,
    }
  });

  if (!tour) {
    return <div>Tour not found</div>;
  }
  return (
    <div>
      <TourDetails tour={tour} />
    </div>
  );
};

export default TourDetailsMain;
