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
const National = () => {
  return (
    <div className="relative pt-8">
    <img src="/mountaine.png" className="w-full h-auto absolute bottom-0 z-0 opacity-30" alt="" />
     <div className="z-20">
     <div className="w-full text-center flex items-center justify-center flex-col gap-2">
        <h1 className="lg:text-4xl text-xl font-bold">Voyages Nationaux</h1>
        <h1 className="lg:w-1/2 text-sm lg:text-lg text-gray-700">
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
            <CarouselItem className="sm:basis-1/3 pb-2 lg:pt-4 py-4 px-6">
              <PromotionCard />{" "}
            </CarouselItem>
          </CarouselContent>
          {/* <div className="w-full flex items-center lg:justify-end md:justify-end justify-center gap-2 pt-8">
            <CarouselPrevious className="static sm:absolute sm:left-0 sm:top-1/2 sm:-translate-y-1/2 w-8 h-8  translate-y-0 left-auto top-auto lg:custom-next text-center lg:flex lg:items-center lg:justify-center bg-orange-800 text-white rounded-full shadow-lg hover:bg-orange-600 transition" />
            <CarouselNext className="static sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 w-8 h-8  translate-y-0 left-auto top-auto custom-prev text-center  flex items-center justify-center bg-white text-slate-800 hover:text-white border border-slate-600 rounded-full shadow-lg hover:bg-orange-600 transition" />
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

export default National;
