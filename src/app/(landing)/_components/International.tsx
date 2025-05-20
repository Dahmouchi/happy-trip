/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PromotionCard } from "./ProductCard";
import { Archive } from "lucide-react";

const International = () => {
  return (
    <div className="relative mt-10">
    <img src="/international.png" className="w-full h-auto absolute bottom-0 z-0 opacity-30" alt="" />
     <div className="z-20">
     <div className="w-full text-center flex items-center justify-center flex-col gap-2">
        <h1 className="lg:text-4xl text-xl font-bold">Voyages Interationaux</h1>
        <h1 className="lg:w-1/2 text-sm lg:text-lg text-gray-500">
          Que vous soyez en quête d&apos;évasion, d&apos;aventure ou de détente,
          nous concevons des escapades inoubliables, accessibles et pleines de
          charme, au cœur du Maroc authentique
        </h1>
      </div>
      <div className=" relative container lg:px-28 py-8  ">
        <Carousel opts={{ align: "center" }} className=" ">
          <CarouselContent className="px-8">
            <CarouselItem className="sm:basis-1/3 pb-2 lg:pt-4 py-4">
              <PromotionCard />{" "}
            </CarouselItem>
            <CarouselItem className="sm:basis-1/3 pb-2 lg:pt-4 py-4">
              <PromotionCard />{" "}
            </CarouselItem>
            <CarouselItem className="sm:basis-1/3 pb-2 lg:pt-4 py-4">
              <PromotionCard />{" "}
            </CarouselItem>
          </CarouselContent>
          {/* <div className="w-full flex items-center justify-end gap-2 pt-8">
            <CarouselPrevious className="custom-next text-center w-8 h-8 flex items-center justify-center bg-orange-800 text-white rounded-full shadow-lg hover:bg-orange-600 transition" />
            <CarouselNext className="custom-prev text-center w-8 h-8 flex items-center justify-center bg-white text-slate-800 hover:text-white border border-slate-600 rounded-full shadow-lg hover:bg-orange-600 transition" />
          </div> */}
          <div className="w-full flex justify-center items-center gap-4 mt-4 sm:justify-end sm:absolute sm:top-1/2 sm:left-auto sm:right-4 sm:translate-y-[-50%]">
            <CarouselPrevious className="static sm:absolute sm:left-0 sm:top-1/2 sm:-translate-y-1/2 w-8 h-8 bg-lime-900 text-white rounded-full hover:bg-lime-900 hover:cursor-pointer transition" />
            <CarouselNext className="static sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 w-8 h-8 bg-white text-slate-800 border border-slate-600 rounded-full hover:bg-lime-900 hover:text-white hover:cursor-pointer transition" />
          </div>
        </Carousel>

        {/* Custom Buttons */}
      </div>
     </div>
    </div>
  );
};

export default International;
