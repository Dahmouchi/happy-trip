/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { CalendarDays, Eye, Users2 } from "lucide-react";
import { motion } from "framer-motion";
import { Rating } from "react-simple-star-rating";
import { Review } from "@prisma/client";

const ModernTravelCard = ({ tour }: any) => {
  // Valeurs par défaut pour éviter les erreurs
  const approvedReviews =
    tour.reviews?.filter((review: Review) => review.status === true) ?? [];

  const reviewCount = approvedReviews.length;
  const averageRating =
    reviewCount > 0
      ? approvedReviews.reduce(
          (sum: any, review: any) => sum + review.rating,
          0
        ) / reviewCount
      : 0;
  return (
    <motion.div
      onClick={() => window.location.href = `/voyage/${tour?.id}`}
      className="w-full h-full max-w-sm rounded-xl overflow-hidden cursor-pointer shadow-xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -5,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        transition: { duration: 0.3 },
      }}
    >
      {/* Image Section */}
      <div className="relative h-[280px] overflow-hidden group">
        {/* Image principale avec effet de zoom au hover */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center w-full h-full transition-transform duration-700"
          style={{

            backgroundImage: `url("${tour?.imageUrl || "/images/product.jpg"}")`,
          }}
          whileHover={{ scale: 1.05 }}
        />

        {/* Overlay dégradé du bas */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent z-10" />

        {/* Badge de réduction conditionnel */}
        {tour.showDiscount &&
          tour.priceOriginal !== tour.priceDiscounted &&
          tour.discountEndDate && (
            <DiscountBadge endDate={tour.discountEndDate.toString()} />
          )}

        {/* Badge de difficulté */}
        {tour.showDifficulty && (
          <motion.div
            className="absolute top-4 right-4 bg-white/90 cardd backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium shadow-md z-20 flex items-center"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            
            <Users2 className="w-4 h-4 mr-1 text-white" />
            <span className="text-gray-50">
              {tour?.groupSizeMax}
            </span>
          </motion.div>
        )}

        {/* Affichage des avis */}
        {tour.showReviews && (
          <motion.div
            className="absolute bottom-3 left-3 z-20 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center">
              <StarRatingDisplay averageRating={averageRating} />
              <span className="text-white text-sm ml-2 font-medium">
                ({reviewCount ?? 0} {(reviewCount ?? 0) === 1 ? "avis" : "avis"}
                )
              </span>
            </div>
          </motion.div>
        )}

        {/* Badge de prix */}
        <motion.div
          className="absolute bottom-3 right-3 z-20 bg-gradient-to-r from-[#8EBD22] to-[#6A9A00] text-white px-4 py-2 rounded-lg shadow-lg flex flex-col items-end"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {tour.showDiscount && tour.priceOriginal !== tour.priceDiscounted && (
            <span className="text-white/80 line-through text-xs">
              {tour?.priceOriginal} DH
            </span>
          )}
          <span className="text-xl font-bold">{tour?.priceDiscounted} DH</span>
        </motion.div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="space-y-4 flex-grow">
          {/* Duration */}
          <motion.div
            className="inline-flex items-center gap-2 bg-[#8EBD22]/10 text-[#8EBD22] p-1.5 px-3 rounded-full"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <CalendarDays className="w-4 h-4" />
            <span className="text-sm font-medium">
              {tour?.durationDays}J / {tour?.durationNights}N
            </span>
          </motion.div>

          {/* Title */}
          <motion.h3
            className="font-bold text-xl text-gray-800 line-clamp-2 min-h-[56px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {tour?.title}
          </motion.h3>

          {/* Information Section */}
          <div className="space-y-3">
            {/* Accommodation - conditionally rendered */}
            {tour?.showHebergement && (
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <img src="/hotel.png" alt="" className="w-5 h-5" />
                </div>
                <p className="text-gray-700">{tour?.accommodationType}</p>
              </motion.div>
            )}

            {/* Date */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <img src="/calendrier.png" alt="" className="w-5 h-5" />
              </div>
              <p className="text-gray-700">{tour?.dateCard}</p>
            </motion.div>
          </div>

          {/* Divider - now positioned above the fixed-height button area */}
          <motion.div
            className="border-t border-gray-100 my-4 mt-auto"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9 }}
          />
        </div>

        {/* Button Section - fixed height container */}
        <div className="">
          <div className="flex justify-between items-center w-full gap-2">
            <div
              onClick={() => window.location.href = `/voyage/${tour?.id}`}
              className="bg-[#8EBD22] carddd rounded-lg cursor-pointer shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] flex items-center justify-between px-4 py-3 w-full text-white hover:bg-[#7DA91D] transition-colors"
            >
              <Eye className="w-6 h-6" />
              <span className="text-white w-full text-center">Programme</span>
            </div>
            {tour.showDifficulty && (
              <div className="w-16 h-full flex items-center justify-center flex-col rounded-lg text-white p-1 cardd">
                <img src="/boot.png" alt="" className="w-4 h-4 -rotate-12" />
                <h1>{tour?.difficultyLevel}/5</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernTravelCard;

const StarRatingDisplay = ({ averageRating }: { averageRating: number }) => {
  return (
    <div className="flex items-center">
      <Rating
        readonly
        initialValue={averageRating}
        size={20}
        allowFraction
        SVGstyle={{ display: "inline-block" }}
        fillColor="#facc15" // Tailwind's yellow-400
        emptyColor="#d1d5db" // Tailwind's gray-300
      />
    </div>
  );
};

const DiscountBadge = ({ endDate }: { endDate: string }) => {
  const currentDate = new Date();
  const promotionEndDate = new Date(endDate);

  // Only show badge if current date is before end date
  if (currentDate > promotionEndDate) return null;

  return (
    <motion.div
      className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg z-50 flex items-center"
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      whileHover={{ scale: 1.05 }}
    >
      <span className="mr-1">PROMO</span>
      <span className="text-xs">
        jusqu&apos;au{" "}
        {promotionEndDate.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </span>
    </motion.div>
  );
};
