/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import Loading from "@/components/Loading";
import SafeHTML from "@/components/SafeHTML";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Card, CardContent } from "@/components/ui/card";
import { Program, Review, Tour, TourDate } from "@prisma/client";
import {
  ArrowRightIcon,
  BadgeCheck,
  BadgePlus,
  BadgeX,
  BanknoteIcon,
  Boxes,
  CalendarIcon,
  ChartNoAxesColumnDecreasing,
  Construction,
  CopyIcon,
  Hotel,
  InfoIcon,
  Map,
  MapPinHouse,
  MessageCircle,
  MountainSnow,
  PhoneIcon,
  Star,
  Tickets,
  Users,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"; // Optional: if you want autoplay
import { toast } from "react-toastify";
import ReservationSection from "./ReservationForm";
import DiscountTimerProduct from "./DiscountBadgeProductPage";
import { ReviewModal } from "./ReviewsForm";

const TourDetails = ({ tour }: { tour: any }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState<any[]>(tour?.dates);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Filter and sort dates to only show future dates
    console.log(tour)
    const now = new Date();
    const futureDates = tour.dates.filter(
      (date: any) => new Date(date.startDate) > now
    );
    setAvailableDates(futureDates);
    setSelectedDate(futureDates[0]?.id || null);
  }, [tour.dates]);

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

  // const sampleTestimonials = [
  //   {
  //     title: "Great Work",
  //     rating: 5,
  //     text: "I think Educrat is the best theme I ever seen this year. Amazing design, easy to customize and a design quality superlative account on its cloud platform for the optimized performance",
  //     name: "Courtney Henry",
  //     role: "Web Designer",
  //     avatarUrl: "/home/ubuntu/upload/image.png", // Replace with actual avatar path
  //   },
  //   {
  //     title: "Excellent Support",
  //     rating: 5,
  //     text: "The support team was incredibly helpful and responsive. They solved my issue within minutes! Highly recommend.",
  //     name: "John Doe",
  //     role: "Developer",
  //     avatarUrl: "/home/ubuntu/upload/image.png", // Replace with actual avatar path
  //   },
  //   {
  //     title: "Feature Rich",
  //     rating: 4,
  //     text: "Packed with features and very flexible. Took a little time to learn everything, but worth it.",
  //     name: "Jane Smith",
  //     role: "Project Manager",
  //     avatarUrl: "/home/ubuntu/upload/image.png", // Replace with actual avatar path
  //   },
  // ];

  const reviews =
    tour.reviews?.map((review: Review) => ({
      name: review.fullName,
      message: review.message,
      rating: review.rating,
      role: "Client",
      avatarUrl: "/home/ubuntu/upload/image.png",
    })) || [];
  const sampleFaqData = [
    {
      id: "item-1",
      question: "Quels sont les modes de paiement acceptés ?",
      answer:
        "Nous acceptons les cartes de crédit Visa, MasterCard, American Express, ainsi que PayPal. Les virements bancaires sont également possibles pour les commandes importantes.",
    },
    {
      id: "item-2",
      question: "Quels sont les délais de livraison ?",
      answer:
        "Les délais de livraison varient en fonction de votre localisation. En général, comptez 2 à 5 jours ouvrables pour la France métropolitaine et 5 à 10 jours pour l'international. Vous recevrez un numéro de suivi dès l'expédition.",
    },
    {
      id: "item-3",
      question: "Comment puis-je retourner un article ?",
      answer:
        "Vous disposez de 30 jours après réception de votre commande pour retourner un article. Veuillez consulter notre politique de retour sur le site pour connaître la procédure détaillée et les conditions.",
    },
    {
      id: "item-4",
      question: "Proposez-vous des réductions pour les étudiants ?",
      answer:
        "Oui, nous proposons une réduction de 10% pour les étudiants sur présentation d'un justificatif valide. Contactez notre service client pour obtenir votre code de réduction.",
    },
  ];

  const sampleAvailableDates =
    tour.dates?.map((date: TourDate) => ({
      id: date.id,
      name: `${new Date(date.startDate!).toLocaleDateString(
        "fr-FR"
      )} - ${new Date(date.endDate!).toLocaleDateString("fr-FR")} (${
        tour.priceDiscounted
      } dh)`,
      visible: date.visible,
    })) || [];

  const sampleHotels =
    tour.hotels?.map((hotel: any) => ({
      id: hotel.id,
      name: hotel.name,
      price: hotel.price,
    })) || [];

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }) // Optional Autoplay
  );
  const includes =
    tour.inclus?.split(";").map((item: any) => item.trim()) || [];
  const excludes =
    tour.exclus?.split(";").map((item: any) => item.trim()) || [];
  const extract =
    tour.extracts?.split(";").map((item: any) => item.trim()) || [];

  function formatDate(date: Date): string {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  // Main: Get the next upcoming date
  function getNextTourDate(dates: TourDate[]): string | null {
    const now = new Date();

    const futureDates = dates
      .filter((d) => d.startDate && new Date(d.startDate) > now)
      .sort(
        (a, b) =>
          new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime()
      );

    if (futureDates.length === 0) return null;

    return formatDate(new Date(futureDates[0].startDate!));
  }

  if (!tour) {
    return <Loading />;
  }
  return (
    <div className="relative">
      <div className="block lg:hidden">
        {tour.showDiscount && tour.priceOriginal !== tour.priceDiscounted && (
          <DiscountTimerProduct endDate={tour.discountEndDate?.toString()} />
        )}
      </div>
      <div className="bg-[#F6F3F2] p-4 md:p-8 lg:p-12">
        {/* Breadcrumbs */}
        <nav className="mb-4 text-sm text-gray-500">
          {tour.type === "NATIONAL" && (
            <span
              className="text-red-600 hover:underline cursor-pointer"
              onClick={() => (window.location.href = "/destination/national")}
            >
              maroc
            </span>
          )}
          {tour.type === "INTERNATIONAL" && (
            <span
              className="text-red-600 hover:underline cursor-pointer"
              onClick={() =>
                (window.location.href = "/destination/international")
              }
            >
              International
            </span>
          )}
          <span className="mx-2">&gt;</span>
          {tour.type === "NATIONAL" && (
            <span
              className="text-red-600 hover:underline cursor-pointer"
              onClick={() =>
                (window.location.href = `/destination/national?destinations=${tour.destinations[0]?.id}`)
              }
            >
              {tour.destinations[0]?.name}
            </span>
          )}
          {tour.type === "INTERNATIONAL" && (
            <span
              className="text-red-600 hover:underline cursor-pointer"
              onClick={() =>
                (window.location.href = `/destination/international?destinations=${tour.destinations[0]?.id}`)
              }
            >
              {tour.destinations[0]?.name}
            </span>
          )}

          <span className="mx-2">&gt;</span>
          <span>{tour.title}</span>
        </nav>

        <div className="flex flex-col-reverse lg:flex-row lg:gap-8 gap-4 items-center">
          {/* Colonne de gauche : Informations */}
          <div className="lg:w-1/2 lg:py-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {tour.title}
            </h1>

            {/* Notation */}
            {tour.showReviews && (
              <div className="flex items-center mb-6">
                <div className="flex mr-2">
                  <StarRatingDisplay averageRating={averageRating} />
                </div>
                <span className="text-gray-600 text-sm ml-1">
                  ({reviewCount} {reviewCount === 1 ? "avis" : "avis"}) •{" "}
                  {averageRating.toFixed(1)}/5
                </span>
              </div>
            )}

            {/* Description */}
           <div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Description</h2>

      <div
        className={clsx(
          "text-gray-700 leading-relaxed transition-all duration-300",
          !expanded && "line-clamp-6"
        )}
      >
        <SafeHTML html={tour.description || ""} />
      </div>

      {tour.description && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-sm text-blue-600 hover:underline focus:outline-none"
        >
          {expanded ? "Voir moins" : "Voir plus"}
        </button>
      )}
    </div>
          </div>

          {/* Colonne de droite : Image */}
          <div className="lg:w-1/2 w-full h-full relative">
            <div className="lg:block hidden">
              {tour.showDiscount &&
                tour.priceOriginal !== tour.priceDiscounted &&
                tour.discountEndDate && (
                  <DiscountTimerProduct
                    endDate={tour.discountEndDate.toString()}
                  />
                )}
            </div>
            <img
              src={tour.imageUrl || ""} // Remplacez par le chemin réel ou l'URL de votre image
              alt="Randonnée Atlas Central"
              className="rounded-lg shadow-md w-full lg:h-[50vh] h-[30vh] object-cover"
              // Pour Next.js, utilisez <Image />
              // import Image from 'next/image';
              // <Image src="/path/to/your/image.jpg" alt="..." width={600} height={400} className="rounded-lg shadow-md" />
            />
          </div>
        </div>
      </div>
      <div className="bg-white">
        {/* Top Info Bar */}
        <div className={`bg-[#8ebd21] text-white grid grid-cols-1 sm:grid-cols-2 ${tour?.showHebergement ? "lg:grid-cols-5": "lg:grid-cols-4"} lg:gap-8 mb-4`}>
          <div className="flex items-center lg:px-0 px-8 justify-start lg:text-nowrap text-xl md:text-lg lg:justify-center gap-2 w-full lg:border-r-2 border-b-2 lg:border-b-0 py-4 border-white lg:my-4 ">
            <img
              src={"/icons/night-mode.png"}
              className="w-7 h-7 md:w-6 md:h-6"
            />{" "}
            {/* Replace with moon/duration icon */}
            <span className="md:text-lg text-xl">
              {tour.durationDays} Jours / {tour.durationNights} Nuités
            </span>
          </div>
          {tour?.showHebergement && <div className="flex items-center lg:px-0 px-8 justify-start lg:text-nowrap text-xl md:text-lg lg:justify-center gap-2 w-full lg:border-r-2 border-b-2 lg:border-b-0 py-4 border-white lg:my-4">
            <img src={"/icons/map-pin.png"} className="w-7 h-7 md:w-6 md:h-6" />{" "}
            {/* Replace with location/pin icon */}
            <span className="md:text-lg text-xl">{tour.accommodationType}</span>
          </div>}
          <div className="flex flex-col items-start lg:items-center lg:px-0 px-8 gap-1 justify-start lg:text-nowrap text-xl md:text-lg lg:justify-center py-4">
            <div className="flex items-center gap-2">
              <img
                src={"/icons/calendar.png"}
                className="w-7 h-7 md:w-6 md:h-6"
              />
              <span className="md:text-lg text-xl">Prochaine date</span>
            </div>
            <span className="md:text-base text-xl ml-9 lg:ml-0 font-semibold bg-white/20 px-4 py-1 rounded-full shadow text-white border border-white/30">
              {getNextTourDate(tour.dates)}
            </span>
          </div>

          <div className="flex flex-col  items-center  px-2 lg:col-span-2 gap-4 bg-[#47663B] text-white py-4  font-semibold">
            {/* Price Section - Now shows price for selected date */}
            <div className="flex items-center gap-2">
              <Tickets className="w-6 h-6" />
              <span className="whitespace-nowrap text-2xl font-bold">
                {selectedDate
                  ? `${tour.type === "INTERNATIONAL" ? "À partir de " : ""}${
                      tour.priceDiscounted
                    } MAD`
                  : "Sélectionnez une date"}
              </span>
            </div>

            {/* Date Dropdown and Booking Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              {/* Modern Dropdown */}
              {availableDates.length > 0 ? (
                <div className="relative w-full lg:w-auto">
                  <select
                    value={selectedDate || ""}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={`
                      appearance-none text-center 
                      bg-white/10 border border-white/20 rounded-full
                      pl-4 pr-8
                      py-2
                      text-white
                      focus:outline-none focus:ring-2 focus:ring-white/30
                      w-full
                      text-base
                      md:pl-3 md:pr-7 md:py-1.5 md:text-sm
                    `}
                  >
                    {availableDates
                      .filter((date) => date.visible)
                      .map((date) => (
                        <option
                          key={date.id}
                          value={date.id}
                          className="text-gray-900"
                        >
                          {formatDate(date.startDate)} - {tour.priceDiscounted}{" "}
                          MAD
                        </option>
                      ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <svg
                      className="h-4 w-4 md:h-3 md:w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="text-white/80 italic text-base md:text-sm">
                  Aucune date disponible actuellement
                </div>
              )}

              {/* Booking Button - Disabled if no dates available */}
              <div>
                <Link
                  href="#"
                  className={`px-6 py-2 rounded-full  text-sm transition-colors whitespace-nowrap w-full sm:w-auto text-center ${
                    availableDates.length > 0
                      ? "bg-white text-[#47663B] hover:bg-lime-700 hover:text-white"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  onClick={(e) => {
                    const el = document.getElementById("reservation-form");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  {availableDates.length > 0 ? "Réserver" : "Complet"}
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 space-y-2 lg:hidden px-2">
          <div className="bg-[#F6F3F2] rounded-lg shadow border border-slate-200 p-4 space-y-4">
            <h3 className="text-xl font-bold text-center text-gray-800 mb-4  border-b pb-2">
              Voyage Details
            </h3>

            {/* Detail Item */}
            {tour.showDifficulty && (
              <div className="flex items-center gap-3 border-b pb-3 justify-between">
                <div className="flex items-center gap-2">
                  <ChartNoAxesColumnDecreasing className="w-6 h-6 text-gray-400" />{" "}
                  {/* Replace with level icon */}
                  <span className="text-gray-600 font-medium w-24">Niveau</span>
                </div>

                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <img
                      src="/boot.png"
                      alt=""
                      key={i}
                      className={
                        i < tour.difficultyLevel
                          ? "bg-green-600 w-8 rounded-md p-1 h-8"
                          : "bg-gray-300 w-8 rounded-md p-1 h-8"
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Detail Item */}
            <div className="flex items-center gap-3 border-b pb-3 justify-between">
              <div className="flex items-center gap-2">
                <Map className="w-6 h-6 text-gray-400" />{" "}
                {/* Replace with destination icon */}
                <span className="text-gray-600 font-medium w-24">
                  Déstination
                </span>
              </div>
              <p>
                {tour.destinations.map((des: any, index: any) => (
                  <span className="text-gray-800" key={index}>
                    {des.name}
                  </span>
                ))}
              </p>
            </div>

            {/* Detail Item */}
            <div className="flex items-center gap-3 border-b pb-3 justify-between">
              <div className="flex items-center gap-2">
                <MountainSnow className="w-6 h-6 text-gray-400" />{" "}
                {/* Replace with theme icon */}
                <span className="text-gray-600 font-medium w-24">
                  Thématique
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {tour.natures.map((des: any, index: any) => (
                  <div
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
                    key={index}
                  >
                    {des.name}{" "}
                  </div>
                ))}
              </div>
            </div>

            {/* Detail Item */}
            <div className="flex items-center gap-3 border-b pb-3 justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-gray-400" />{" "}
                {/* Replace with group size icon */}
                <span className="text-gray-600 font-medium ">
                  Taille du groupe
                </span>
              </div>

              <span className="text-gray-800">{tour.groupSizeMax}</span>
            </div>

            {/* Detail Item */}
            {tour?.showHebergement && <div className="flex items-center gap-3 border-b pb-3 justify-between">
              <div className="flex items-center gap-2">
                <Hotel className="w-6 h-6 text-gray-400" />{" "}
                {/* Replace with accommodation icon */}
                <span className="text-gray-600 font-medium w-24">
                  Hébergement
                </span>
              </div>
              <span className="text-gray-800">{tour.accommodationType}</span>
            </div>}

            {/* Detail Item */}
            <div className="flex items-center gap-3 pb-3 justify-between">
              <div className="flex items-center justify-between gap-2">
                <Boxes className="w-6 h-6 text-gray-400" />{" "}
                {/* Replace with services icon */}
                <span className="text-gray-600 font-medium w-24">Services</span>
              </div>
              <div className="flex flex-col gap-2">
                {tour.services?.map((ser: any, index: any) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium border border-green-200"
                  >
                    {ser.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Reserve Button */}
            <button
              className="w-full bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-900 transition-colors mt-4"
              onClick={() => {
                const el = document.getElementById("reservation-form");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Réserver
            </button>
          </div>
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:py-4 py-2 px-2 lg:px-12 ">
          {/* Left Column (Video & Itinerary) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Section */}
            {tour.videoUrl && (
              <div className="bg-black rounded-lg overflow-hidden aspect-video relative">
                {/* Placeholder for video player - replace with actual video embed */}
                <img
                  src="/home/ubuntu/upload/image.png"
                  alt="Video placeholder showing pool area"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={tour.videoUrl || ""}
                    title="YouTube video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                {/* Add controls overlay if needed */}
              </div>
            )}

            {/* Itinerary Section */}
            <div className="mt-8">
              <h1 className="text-2xl font-bold">Programme : </h1>
            </div>
            <Accordion
              type="single"
              collapsible
              className="space-y-3"
              defaultValue={tour.programs[0]?.id}
            >
              {tour.programs.map((prog: Program) => (
                <AccordionItem value={prog.id} key={prog.id}>
                  <AccordionTrigger className="bg-[#8ebd21] rounded-t-lg cursor-pointer px-4 py-3 text-white">
                    {prog.title}
                  </AccordionTrigger>
                  <AccordionContent className=" p-2 border border-slate-200 shadow-xs rounded-b-lg ">
                    <div className="grid lg:grid-cols-3 grid-cols-1 lg:p-4 p-2 gap-2">
                      <div className="col-span-2">
                        <SafeHTML html={prog.description || ""} />
                      </div>
                      <div className="col-span-1">
                        {prog.imageUrl && (
                          <img
                            src={prog.imageUrl || ""} // Remplacez par le chemin réel ou l'URL de votre image
                            alt="Randonnée Atlas Central"
                            className="rounded-lg shadow-md w-full h-auto object-cover"
                            // Pour Next.js, utilisez <Image />
                            // import Image from 'next/image';
                            // <Image src="/path/to/your/image.jpg" alt="..." width={600} height={400} className="rounded-lg shadow-md" />
                          />
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="bg-white p-6 lg:px-12 md:p-8 font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Included Section */}
                {tour.inclus !== "" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">
                      Qu&apos;est-ce qui est inclus dans cet circuit?
                    </h2>
                    <p className="text-sm text-gray-500 mb-4 pb-2 border-b border-gray-200">
                      Les éléments qui sont inclus dans le coût du prix de la
                      tournée.
                    </p>
                    <ul className="list-none p-0 m-0">
                      {includes.map((item: any, index: any) => (
                        <div
                          key={`inc-${index}`}
                          className="flex items-center gap-2 mt-2"
                        >
                          <span className="pt-1 text-green-600">
                            <BadgeCheck className="w-6.5 h-6.5 min-w-[20px] min-h-[20px] bg-green-100 rounded-full p-1" />
                          </span>
                          <p className="break-words">{item}</p>
                        </div>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Excluded Section */}
                {tour.exclus !== "" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">
                      Qu&apos;est-ce qui n&apos;est pas inclus dans cet circuit?
                    </h2>
                    <p className="text-sm text-gray-500 mb-4 pb-2 border-b border-gray-200">
                      Les éléments qui ne sont pas inclus dans le coût du prix
                      de la tournée.
                    </p>
                    <ul className="list-none p-0 m-0">
                      {excludes.map((item: any, index: any) => (
                        <div
                          key={`exc-${index}`}
                          className="flex items-center gap-2 mt-2"
                        >
                          <span className="pt-1 text-red-600">
                            <BadgeX className="w-6.5 h-6.5 min-w-[20px] min-h-[20px] bg-red-100 rounded-full p-1" />
                          </span>
                          <p className="break-words">{item}</p>
                        </div>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {tour.extracts !== "" && (
                <div>
                  <h2 className="text-xl font-bold mt-3 text-gray-800 mb-1">
                    Quels sont les suppléments ou extras pour cette tournée ?
                  </h2>
                  <p className="text-sm text-gray-500 mb-4 pb-2 border-b border-gray-200">
                    Les éléments optionnels ou les frais supplémentaires qui
                    peuvent s&apos;ajouter au prix de la tournée.
                  </p>
                  <ul className="list-none p-0 m-0">
                    {extract.map((item: any, index: any) => (
                      <div
                        key={`exc-${index}`}
                        className="flex items-center gap-2 mt-2"
                      >
                        <span className="pt-1 text-blue-600">
                          <BadgePlus className="w-6.5 h-6.5 min-w-[20px] min-h-[20px] bg-red-100 rounded-full p-1" />
                        </span>
                        <p className="break-words">{item}</p>
                      </div>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-1 space-y-2 ">
            <div className="bg-[#F6F3F2] rounded-lg shadow border lg:block hidden border-slate-200 p-4 space-y-4">
              <h3 className="text-xl font-bold text-center text-gray-800 mb-4  border-b pb-2">
                Voyage Details
              </h3>

              {/* Detail Item */}
              {tour.showDifficulty && (
                <div className="flex items-center gap-3 border-b pb-3 justify-between">
                  <div className="flex items-center gap-2">
                    <ChartNoAxesColumnDecreasing className="w-6 h-6 text-gray-400" />{" "}
                    {/* Replace with level icon */}
                    <span className="text-gray-600 font-medium w-24">
                      Niveau
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                      <img
                        src="/boot.png"
                        alt=""
                        key={i}
                        className={
                          i < tour.difficultyLevel
                            ? "bg-green-600 w-8 rounded-md p-1 h-8"
                            : "bg-gray-300 w-8 rounded-md p-1 h-8"
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Detail Item */}
              <div className="flex items-center gap-3 border-b pb-3 justify-between">
                <div className="flex items-center gap-2">
                  <Map className="w-6 h-6 text-gray-400" />{" "}
                  {/* Replace with destination icon */}
                  <span className="text-gray-600 font-medium w-24">
                    Déstination
                  </span>
                </div>
                <p>
                  {tour.destinations.map((des: any, index: any) => (
                    <span className="text-gray-800" key={index}>
                      {des.name}
                    </span>
                  ))}
                </p>
              </div>

              {/* Detail Item */}
              <div className="flex items-center gap-3 border-b pb-3 justify-between">
                <div className="flex items-center gap-2">
                  <MountainSnow className="w-6 h-6 text-gray-400" />{" "}
                  {/* Replace with theme icon */}
                  <span className="text-gray-600 font-medium w-24">
                    Thématique
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {tour.natures.map((des: any, index: any) => (
                    <div
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
                      key={index}
                    >
                      {des.name}{" "}
                    </div>
                  ))}
                </div>
              </div>

              {/* Detail Item */}
              <div className="flex items-center gap-3 border-b pb-3 justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-gray-400" />{" "}
                  {/* Replace with group size icon */}
                  <span className="text-gray-600 font-medium ">
                    Taille du groupe
                  </span>
                </div>

                <span className="text-gray-800">{tour.groupSizeMax}</span>
              </div>

              {/* Detail Item */}
              <div className="flex items-center gap-3 border-b pb-3 justify-between">
                <div className="flex items-center gap-2">
                  <Hotel className="w-6 h-6 text-gray-400" />{" "}
                  {/* Replace with accommodation icon */}
                  <span className="text-gray-600 font-medium w-24">
                    Hébergement
                  </span>
                </div>
                <span className="text-gray-800">{tour.accommodationType}</span>
              </div>

              {/* Detail Item */}
              <div className="flex items-center gap-3 pb-3 justify-between">
                <div className="flex items-center gap-2 justify-between">
                  <Boxes className="w-6 h-6 text-gray-400" />{" "}
                  {/* Replace with services icon */}
                  <span className="text-gray-600 font-medium w-24">
                    Services
                  </span>
                </div>
                <div className="gap-2 flex flex-col">
                  {tour.services?.map((ser: any, index: any) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium border border-green-200"
                    >
                      {ser.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reserve Button */}
              <button
                className="w-full bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-900 transition-colors mt-4"
                onClick={() => {
                  const el = document.getElementById("reservation-form");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Réserver
              </button>
            </div>
            {/* Reviews Section */}
            {tour.showReviews && (
              <div className="bg-[#F6F3F2]  p-6 md:p-8 rounded-xl border border-slate-200 shadow-lg max-w-2xl mx-auto font-sans">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-center">
                  <MessageCircle />
                  Les avis
                </h2>
                {approvedReviews.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Aucun avis pour ce tour pour le moment.
                  </div>
                ) : approvedReviews.length > 1 ? (
                  <Carousel
                    plugins={[plugin.current]} // Add plugin ref here for autoplay
                    className="w-full"
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    onMouseEnter={plugin.current.stop} // Optional: pause on hover
                    onMouseLeave={plugin.current.reset}
                  >
                    <CarouselContent>
                      {approvedReviews.map((review: Review, index: number) => (
                        <CarouselItem
                          key={index}
                          className="md:basis-1/1 lg:basis-1/1"
                        >
                          {/* Show 1 item at a time */}
                          <div className="p-1">
                            <ReviewsCard
                              review={{
                                name: review.fullName,
                                message: review.message,
                                rating: review.rating,
                                role: "Client",
                                avatarUrl: "/home/ubuntu/upload/image.png",
                              }}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-lime-400 hover:bg-lime-500 text-white border-none rounded-full w-8 h-8" />
                    <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-lime-400 hover:bg-lime-500 text-white border-none rounded-full w-8 h-8" />
                  </Carousel>
                ) : (
                  <div className="w-full">
                    <ReviewsCard
                      review={{
                        name: approvedReviews[0].fullName,
                        message: approvedReviews[0].message,
                        rating: approvedReviews[0].rating,
                        role: "Client",
                        avatarUrl: "/home/ubuntu/upload/image.png",
                      }}
                    />
                  </div>
                )}
                <ReviewModal tourId={tour.id} />
              </div>
            )}
            <BookingSteps advance={tour?.advancedPrice} />
          </div>
        </div>
      </div>

      <div id="reservation-form">
        <ReservationsForm
          fields={tour.reservationForm[0]?.fields || []}
          tourId={tour.id}
          basePrice={tour.priceDiscounted}
          travelDates={tour.dates || []}
        />
        {/* <ReservationSection
          availableDates={sampleAvailableDates}
          hotels={sampleHotels}
          tour={tour}
          imageSrc="/path/to/your/image.jpg" // Provide image path
        /> */}
      </div>
      <div className="bg-[#F6F3F2] p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center justify-center">
          <CalendarIcon />
          Dates & prix
        </h2>
        {/* Header Row */}
        <div className="hidden md:grid grid-cols-4 gap-4 mb-2 text-sm font-semibold text-gray-600 px-4">
          <span>De</span>
          <span>Au</span>
          <span>Prix</span>
          <span>Réservez votre aventure</span>
        </div>
        {/* Data Rows */}
        <div className="space-y-2">
          {tour.dates.map((item: any, index: any) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 items-center p-3 md:px-4 rounded border-b-2 border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-sm text-gray-700">
                <span className="md:hidden font-semibold">De: </span>
                {formatDate(item.startDate)}
              </div>
              <div className="text-sm text-gray-700">
                <span className="md:hidden font-semibold">Au: </span>
                {formatDate(item.endDate)}
              </div>
              <div className="text-sm font-bold text-gray-800">
                <span className="md:hidden font-semibold">Prix: </span>
                {tour.priceDiscounted} DH
              </div>
              <div className="mt-2 md:mt-0">
                <button
                  className="w-full md:w-auto bg-green-700 hover:bg-green-800 text-white text-sm font-semibold py-2 px-4 rounded-md flex items-center justify-center transition-colors"
                  onClick={() => {
                    const el = document.getElementById("reservation-form");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  Réserver
                  <ArrowRightIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {tour.googleMapsUrl && (
        <div className="bg-white p-6 lg:px-12 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3 justify-center">
            <MapPinHouse />
            Votre Destination.
          </h2>
          {/* Map Placeholder - Replace with actual map embed or component */}
          <div className="mb-3 rounded overflow-hidden border border-gray-200 w-full">
            <iframe
              className="w-full rounded-xl"
              src={tour.googleMapsUrl}
              width={600}
              height={450}
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}
      <FaqSection faqData={sampleFaqData} />
    </div>
  );
};

export default TourDetails;
import { Rating } from "react-simple-star-rating";
import WhatsappShare from "./whatsappShare";
import ReservationsForm from "./reservationsForm";
import clsx from "clsx";

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

const ReviewsCard = ({ review }: { review: any }) => {
  return (
    <Card className="mx-2 border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-4">
      <CardContent className="p-6 flex flex-col items-start text-left">
        <div className="flex justify-between items-center w-full mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={
                  i < review?.rating ? "text-yellow-400" : "text-gray-300"
                }
                fill={i < review?.rating ? "#facc15" : "none"}
              />
            ))}
          </div>
          <div className="flex"></div>
        </div>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          &quot;{review?.message}&quot;
        </p>
        <div className="flex items-center mt-auto pt-4 border-t border-gray-100 w-full">
          <img
            src="/icons/user.png" // Replace with actual image path or use next/image
            alt={review?.name}
            className="w-10 h-10 rounded-full mr-3 object-cover"
            // Example with next/image:
            // import Image from 'next/image';
            // <Image src={review?.avatarUrl} alt={review?.name} width={40} height={40} className="rounded-full mr-3" />
          />
          <div>
            <p className="font-semibold text-gray-800 text-sm">
              {review?.name}
            </p>
            <p className="text-gray-500 text-xs">{review?.role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
const FaqSection = ({
  faqData,
  title = "Questions fréquemment posées",
}: any) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8 font-sans">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center">
        {/* Optional Icon */}
        {/* <QuestionIcon /> */}
        {title}
      </h2>

      {/* Shadcn Accordion Component */}
      <Accordion type="single" collapsible className="w-full space-y-3">
        {faqData.map((item: any) => (
          <AccordionItem
            key={item.id}
            value={item.id} // Use unique ID for value
            className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden"
          >
            <AccordionTrigger className="flex justify-between items-center w-full p-4 md:p-5 text-left font-medium text-gray-700 hover:bg-gray-50 transition-colors [&[data-state=open]>svg]:rotate-180">
              <span className="flex-1 mr-4">{item.question}</span>
              {/* Default chevron is included in AccordionTrigger, styled via CSS */}
              {/* You can customize the icon if needed */}
              {/* <ChevronDownIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" /> */}
            </AccordionTrigger>
            <AccordionContent className="p-4 md:p-5 pt-0 text-gray-600 text-sm leading-relaxed bg-white">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
const BookingSteps = ({ advance }: { advance: any }) => {
  const rib = "007 810 0004494000304008 16";
  const phoneNumber = "0628324880";
  const email = "happy.trip.voyage@gmail.com";

  // Basic copy to clipboard function
  const copyToClipboard = (text: any) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.info(`"${text}" copié dans le presse-papiers !`); // Simple feedback
      })
      .catch((err) => {
        console.error("Erreur de copie: ", err);
        toast.info("Erreur lors de la copie.");
      });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 font-sans bg-[#F6F3F2] rounded-lg shadow border border-slate-200">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
        Comment faire la réservation
      </h2>
      <p className="text-center text-sm text-gray-600 mb-8">
        La réservation est ouverte à la limite des places disponibles.
      </p>

      {/* Steps Section */}
      <div className="space-y-2 mb-10">
        {/* Step 1: Check Availability */}
        <div className="flex items-start space-x-2 p-4 bg-white rounded-lg border border-blue-100">
          <div className="flex-shrink-0 pt-1">
            <PhoneIcon />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Étape 1 : Vérifier la disponibilité
            </h3>
            <p className="text-gray-700 text-sm">
              Contactez le numéro du club ({phoneNumber}) pour vérifier la
              disponibilité des places avant de procéder.
            </p>
          </div>
        </div>

        {/* Step 2: Make Payment */}
        <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-green-100">
          <div className="flex-shrink-0 pt-1">
            <BanknoteIcon />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Étape 2 : Effectuer le virement
            </h3>
            <p className="text-gray-700 text-sm mb-2">
              Faites la réservation par virement bancaire de{" "}
              <strong>{advance}dh</strong> au RIB du club.
            </p>
            <div className="text-sm bg-gray-100 p-3 rounded border border-gray-200">
              <p className="font-medium text-gray-600 mb-1">
                Banque: Attijariwafa Bank
              </p>
              <div className="flex items-center">
                <p className="font-mono text-gray-800 mr-2">RIB: {rib}</p>
                <button
                  className="cursor-pointer"
                  onClick={() => copyToClipboard(rib)}
                  title="Copier le RIB"
                >
                  <CopyIcon />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Send Proof */}
        <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-teal-100">
          <div className="flex-shrink-0 pt-1">
            <img src={"/icons/whatsapp.png"} className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Étape 3 : Envoyer le reçu
            </h3>
            <p className="text-gray-700 text-sm mb-2">
              Renvoyez le reçu du virement via Whatsapp ({phoneNumber}) avec le
              nom et prénom du participant.
            </p>
            <p className="text-xs text-red-600 font-medium">
              <strong>Important :</strong> N&apos;oubliez pas de demander au
              banquier de s&apos;assurer que le compte est au nom de Ayoub.
            </p>
          </div>
        </div>

        {/* Step 4: Club Rights */}
        <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-orange-100">
          <div className="flex-shrink-0 pt-1">
            <InfoIcon />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Information importante
            </h3>
            <p className="text-gray-700 text-sm">
              Le club se réserve le droit de modifier le programme en
              s&apos;assurant de la sécurité des Happy Trippers selon les
              circonstances du voyage.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="text-center border-t pt-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact</h3>
        <p className="text-sm text-gray-600 mb-1">
          GSM/Whatsapp: {phoneNumber}
        </p>
        <p className="text-sm text-gray-600">Email: {email}</p>
      </div>
      <div className="text-center mt-6">
        <CombinedButtons
          whatsappProps={{
            phoneNumber: "1234567890",
            message: "Hello I want to make a reservation",
          }}
          reservationFormId="reservation-form"
        />
      </div>
    </div>
  );
};
interface CombinedButtonsProps {
  whatsappProps: any;
  reservationFormId: string; // ID of your reservation form element
}

const CombinedButtons: React.FC<CombinedButtonsProps> = ({
  whatsappProps,
  reservationFormId,
}) => {
  const [showReservationButton, setShowReservationButton] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const formElement = document.getElementById(reservationFormId);
      if (formElement) {
        const formPosition = formElement.getBoundingClientRect().top;
        // Hide reservation button when form is in view (with some threshold)
        setShowReservationButton(formPosition > window.innerHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reservationFormId]);

  const scrollToReservation = () => {
    const formElement = document.getElementById(reservationFormId);
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-6 right-24 flex flex-col gap-4 items-end z-[1000] lg:w-auto w-full">
      <WhatsappShare {...whatsappProps} />
      {showReservationButton && (
        <button
          onClick={scrollToReservation}
          className="reservation-btn bg-gradient-to-r from-[#9fe300] lg:w-auto w-1/2 cursor-pointer to-[#7bc200] text-white font-medium rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:translate-y-0 active:scale-100 group"
          aria-label="Scroll to reservation form"
        >
          <span className="relative flex items-center justify-center gap-2">
            <span>Réservation</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      )}

      <style jsx>{`
        .reservation-scroll-btn {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 600px) {
          .reservation-scroll-btn {
            width: 50px;
            height: 50px;
          }
        }
      `}</style>
    </div>
  );
};
