// components/ToursDisplay.tsx
"use client";

import { Tour } from "@prisma/client";
import { PromotionCard } from "./ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function ToursDisplay({
  tours,
  title,
  displayMode = 'grid',
}: {
  tours: Tour[];
  title:boolean;
  displayMode?: 'grid' | 'carousel';
}) {
  return (
    <div className="relative mt-10 min-h-screen">
      <div
    className="absolute inset-0 bg-[url('/mountaine.png')] bg-cover bg-center"
    style={{ opacity: 0.1, zIndex: 0 }}
  />  
  <div className="z-20">
       {title &&  <div className="w-full text-center flex items-center justify-center flex-col gap-2">
        <h1 className="lg:text-4xl text-xl font-bold">Voyages Nationaux</h1>
        <h1 className="lg:w-1/2 text-sm lg:text-lg text-gray-700">
          Que vous soyez en quête d&apos;évasion, d&apos;aventure ou de détente,
          nous concevons des escapades inoubliables, accessibles et pleines de
          charme, au cœur du Maroc authentique
        </h1>
      </div>
      }
      <div className="w-full lg:px-24">
        {displayMode === 'carousel' ? (
        <Carousel opts={{ align: "center" }}>
          <CarouselContent className="px-8">
            {tours.map((tour) => (
              <CarouselItem
                key={tour.id}
                className="basis-full sm:basis-1/2 lg:basis-1/3 pb-2 lg:pt-4 py-4"
              >
                <PromotionCard tour={tour} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="w-full flex justify-center items-center gap-4 mt-4 sm:justify-end sm:absolute sm:top-1/2 sm:left-auto sm:right-4 sm:translate-y-[-50%]">
            <CarouselPrevious className="static sm:absolute sm:left-0 sm:top-1/2 sm:-translate-y-1/2 w-8 h-8 bg-lime-900 text-white rounded-full hover:bg-lime-900 hover:cursor-pointer transition" />
            <CarouselNext className="static sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 w-8 h-8 bg-white text-slate-800 border border-slate-600 rounded-full hover:bg-lime-900 hover:text-white hover:cursor-pointer transition" />
          </div>
        </Carousel>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-3">
          {tours.map((tour) => (
            <div key={tour.id} className="">
              <PromotionCard tour={tour} />
            </div>
          ))}
        </div>
      )}

      {tours.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun voyage trouvé</p>
        </div>
      )}
      </div>
      </div>
    </div>
  );
}