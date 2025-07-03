import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Tour } from "@prisma/client";
import { InternationalCard } from "./ProductCardInternational";

const International = ({ tour }: { tour: Tour[] }) => {
  return (
    <div className="relative mt-10 min-h-screen">
      <div
        className="absolute inset-0 bg-[url('/international.png')] bg-cover bg-center"
        style={{ opacity: 0.1, zIndex: 0 }}
      />{" "}
      <div className="z-20">
        <div className="w-full text-center flex items-center justify-center flex-col gap-2">
          <h1 className="lg:text-4xl text-xl font-bold">
            Voyages Interationaux
          </h1>
          <h1 className="lg:w-1/2 text-sm lg:text-lg text-gray-500">
            Que vous soyez en quête d&apos;évasion, d&apos;aventure ou de
            détente, nous concevons des escapades inoubliables, accessibles et
            pleines de charme, au cœur du Maroc authentique
          </h1>
        </div>
        <div className=" relative  lg:px-28 py-8  ">
                      {" "}
                      {/* Added relative positioning */}
                      <Carousel
                        opts={{
                          align: "center",
                        }}
                        className="relative" // Added relative positioning
                      >
                    <CarouselContent className="px-8">
                          {" "}
                          {/* Adjusted padding */}
                          {tour
                            .filter((tour) => tour.active)
                            .map((tour) => (
                              <CarouselItem
                                key={tour.id}
                                className="sm:basis-1/3 pb-2 lg:pt-4 py-4" // Adjusted basis and padding
                              >
                                <InternationalCard tour={tour} />
                              </CarouselItem>
                            ))}
                        </CarouselContent>
        
                        {/* Navigation Buttons - positioned outside card area */}
                        <div className="hidden sm:block absolute -left-0 top-1/2 -translate-y-1/2">
                          <CarouselPrevious className="w-10 h-10 bg-white text-lime-900 rounded-full shadow-lg hover:bg-lime-900 hover:text-white transition-all border border-gray-200" />
                        </div>
                        <div className="hidden sm:block absolute -right-0 top-1/2 -translate-y-1/2">
                          <CarouselNext className="w-10 h-10 bg-white text-lime-900 rounded-full shadow-lg hover:bg-lime-900 hover:text-white transition-all border border-gray-200" />
                        </div>
        
                        {/* Mobile Navigation - centered below cards */}
                        <div className="sm:hidden flex justify-center gap-4 mt-4">
                          <CarouselPrevious className="static w-10 h-10 bg-white text-lime-900 rounded-full shadow hover:bg-lime-900 hover:text-white transition-all border border-gray-200" />
                          <CarouselNext className="static w-10 h-10 bg-white text-lime-900 rounded-full shadow hover:bg-lime-900 hover:text-white transition-all border border-gray-200" />
                        </div>
                      </Carousel>
                    </div>
      </div>
    </div>
  );
};

export default International;
