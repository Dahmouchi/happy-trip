import { CalendarDays, Eye } from "lucide-react";
import React from "react";

export function PromotionCard() {
  return (
    <div className="max-w-sm h-full rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white">
      {/* Discount Ribbon
      <div className="bg-red-600 text-white text-center py-1 font-bold">
        Réduction de 10%
      </div>
      
      <div className="bg-gray-100 p-3 text-center">
        <div className="text-2xl font-mono font-bold text-gray-800">
          23 : 07 : 51
        </div>
      </div> */}
      <div
        className="w-full h-[40vh] bg-green-500 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/images/product.jpg')" }}
      >
        <div className="absolute top-0 right-0 space-y-2">
        <div className="py-1 px-4 bg-red-500 rounded-tr-lg rounded-bl-lg flex itce justify-center text-white">
            <h1 className="text-sm">Réduction de 10%</h1>
        </div>

        <div className="flex items-center justify-between text-white font-black mr-2">
        <div className="bg-red-500 border-[2px] border-white rounded-md p-2 flex items-center justify-center text-xs text-white font-bold">15</div>
        <h1>:</h1>
        <div className="bg-red-500 border-[2px] border-white rounded-md p-2 flex items-center justify-center text-xs text-white font-bold">02</div>
        <h1>:</h1>
        <div className="bg-red-500 border-[2px] border-white rounded-md p-2 flex items-center justify-center text-xs text-white font-bold">37</div>
        </div>
        </div>
        <div className="w-full h-1/3 bg-gradient-to-t from-white to-white/0 absolute bottom-0 z-0"></div>
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
        <div className="items-baseline mb-4 text-right absolute py-1 -bottom-8 bg-[#4FA8FF] w-1/2 rounded-l-full px-2 right-0">
          <h1 className="text-white line-through mr-2 text-xs">4500 DH</h1>
          <h1 className="text-xl font-bold text-white">3000 DH</h1>
        </div>
      </div>
      
      <div className="p-4 bg-white">
        {/* Tour Info */}
        <div className="bg-[#8EBD22] w-fit flex items-center gap-2 text-white p-1 px-2">
        <CalendarDays className="w-5 h-5" />
        <div className="text-xs">7J / 6N</div>
      </div>
        <div className="mb-4 space-y-2 mt-2">
          <h3 className="font-bold text-lg mb-1">
            Tour d&apos;Anti-Atlas: Tafraout, Amtoudi, vallée Ait Mansour
          </h3>
          <div className="flex items-center gap-2">
            <img src="/hotel.png" alt="" className="w-6 h-6 " />
            <p className="text-gray-700 mb-1">AUBERGE VUE SUR MER</p>
          </div>
          <div className="flex items-center gap-2">
            <img src="/calendrier.png" alt="" className="w-6 h-6 " />
            <div>
              <p className="text-gray-700">09 au 10 mai 2025</p>
              <p className="text-gray-500 text-sm">Chaque weekend en mai</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Program Rating */}
        <div className="flex justify-between items-center w-full gap-2">
          <div className="bg-[#8EBD22] rounded-lg shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] flex itce justify-between px-4 py-3 w-full text-white">
            <Eye className="w-6 h-6" />
            <span className="text-white w-full text-center">Programme</span>
          </div>
          <div className="w-16 h-full flex items-center justify-center flex-col rounded-lg text-white p-1 bg-[#4FA8FF]">
            <img src="/boot.png" alt="" className="w-4 h-4 -rotate-12" />
            <h1>2/5</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
