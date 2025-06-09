/* eslint-disable @next/next/no-img-element */
"use client";
import { Tour } from "@prisma/client";
import { CalendarDays, Eye } from "lucide-react";
import { redirect } from "next/navigation";
import DiscountBadge from "./DiscountBadge";

export function PromotionCard({ tour }: { tour: Tour }) {
  return (
    <div className="max-w-sm h-full flex flex-col justify-between rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white">
      <div className="w-full h-[40vh] bg-green-500 relative bg-cover bg-center group">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{
            backgroundImage: `url(${tour?.imageUrl || "/images/product.jpg"})`,
          }}
        ></div>
        {tour.showDiscount && (
          <DiscountBadge endDate={tour.createdAt.toString()} />
        )}
        <div className="w-full h-1/3 bg-gradient-to-t from-white to-white/0 absolute bottom-0 z-0"></div>
        {tour.showReviews && (
          <div className="flex items-center mb-4 z-10 absolute -bottom-2 left-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < 2 ? "text-yellow-400" : "text-gray-400"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600 ml-2">(25)</span>
          </div>
        )}
        <div className={`items-baseline mb-4 text-right absolute ${tour.showDiscount && tour.priceOriginal !== tour.priceDiscounted ? "py-1":"py-2"} z-50 -bottom-8 bg-[#4FA8FF] w-fit rounded-l-full px-8 right-0`}>
          {tour.showDiscount && tour.priceOriginal !== tour.priceDiscounted && (
            <h1 className="text-white line-through mr-2 text-xs">
              {tour?.priceOriginal} DH
            </h1>
          )}

          <h1 className="text-xl font-bold text-white">
            {tour?.priceDiscounted} DH
          </h1>
        </div>
      </div>

      <div className="p-4 flex flex-col justify-end bg-white z-40">
        {/* Tour? Info */}
        <div className="bg-[#8EBD22] w-fit flex items-center gap-2 text-white p-1 px-2">
          <CalendarDays className="w-5 h-5" />
          <div className="text-xs">
            {tour?.durationDays}J / {tour?.durationNights}N
          </div>
        </div>
        <div className="mb-4 space-y-2 mt-2">
          <h3 className="font-bold text-lg mb-1 line-clamp-2">{tour?.title}</h3>
          <div className="flex items-center gap-2">
            <img src="/hotel.png" alt="" className="w-6 h-6 " />
            <p className="text-gray-700 mb-1">{tour?.accommodationType}</p>
          </div>
          <div className="flex items-center gap-2">
            <img src="/calendrier.png" alt="" className="w-6 h-6 " />
            <div>
              <p className="text-gray-700">{tour?.dateCard}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div>
          <div className="border-t border-gray-200 my-4"></div>

          {/* Program Rating */}
          <div className="flex justify-between items-center w-full gap-2">
            <div
              onClick={() => redirect(`/destination/national/t/${tour?.id}`)}
              className="bg-[#8EBD22] rounded-lg cursor-pointer shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] flex itce justify-between px-4 py-3 w-full text-white"
            >
              <Eye className="w-6 h-6" />
              <span className="text-white w-full text-center">Programme</span>
            </div>
            <div className="w-16 h-full flex items-center justify-center flex-col rounded-lg text-white p-1 bg-[#4FA8FF]">
              <img src="/boot.png" alt="" className="w-4 h-4 -rotate-12" />
              <h1>{tour?.difficultyLevel}/5</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
