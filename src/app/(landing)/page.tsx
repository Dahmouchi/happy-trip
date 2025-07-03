/* eslint-disable @typescript-eslint/no-unused-vars */

import Hero from "./_components/Hero";
import { ToursDisplay } from "./_components/National";
import International from "./_components/International";
import Mesure from "./_components/Mesure";
import ReviewsSection from "./_components/Reviews";
import Meeting from "./_components/Meeting";
import Expert from "./_components/Expert";
import Trust from "./_components/Trust";
import { Landing, Tour } from "@prisma/client";
import prisma from "@/lib/prisma";
import { endOfMonth, startOfMonth } from "date-fns";
//import MonthlyFeaturedTours from "./_components/thisMount";

const LandigPage = async () => {
  const now = new Date();

const firstDay = startOfMonth(now);
const lastDay = endOfMonth(now);
  const sections: Landing | null = await prisma.landing.findFirst({ });
  const tourForThisMount = await prisma.tour.findMany({
  where: {
    dates: {
      some: {
        startDate: {
          gte: firstDay,
          lte: lastDay,
        },
      },
    },
  },
  include: {
    reviews: true,
    dates: true, // include matching TourDate entries
  },
  orderBy: {
    createdAt: "desc",
  },
});
  const tourNational: Tour[] | null = await prisma.tour.findMany({
    where: {
      type: "NATIONAL",
    },
    include: {
      reviews: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const tourInternational: Tour[] | null = await prisma.tour.findMany({
    where: {
      type: "INTERNATIONAL",
    },
    include: {
      reviews: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      {/*{(sections?.navbar ?? true) && 
        <div className="lg:px-6 w-full px-3">
          <div className="bg-[#8EBD22] lg:rounded-b-2xl rounded-b-lg shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] flex items-center justify-center py-4">
            <h1 className="text-white text-xs lg:text-lg text-center">
              Nos packs SUMMER 2025 sont disponibles Dés Maintenant!
            </h1>
          </div>(sections?.thisMount ?? true) &&  <MonthlyFeaturedTours tours={tourForThisMount} />
        </div>
      } */}
      {(sections?.hero ?? true) && <Hero inp={sections} />}
      
     
      {(sections?.national ?? true) && <ToursDisplay
                tours={tourNational} 
                displayMode={"carousel"}
                title={true}
              />}
      {(sections?.international ?? true) && (
        <International tour={tourInternational} />
      )}
      {(sections?.mesure ?? true) && <Mesure />}
      {(sections?.reviews ?? true) && <ReviewsSection />}
      {(sections?.meeting ?? true) && <Meeting />}
      {(sections?.expert ?? true) && <Expert />}
      {(sections?.trust ?? true) && <Trust />}
    </div>
  );
};

export default LandigPage;
