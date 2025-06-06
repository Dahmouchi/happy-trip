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
import { Program, Tour, TourDate } from "@prisma/client";
import {
  ArrowRightIcon,
  BadgeCheck,
  BadgeX,
  Boxes,
  CalendarIcon,
  ChartNoAxesColumnDecreasing,
  Construction,
  Hotel,
  LocateIcon,
  Map,
  MapPinHouse,
  MessageCircle,
  MountainSnow,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"; // Optional: if you want autoplay

const TourDetails = ({ tour }: { tour: any }) => {
  const rating = 4; // Note sur 5
  const reviewCount = 90;
  const sampleTestimonials = [
    {
      title: "Great Work",
      rating: 5,
      text: "I think Educrat is the best theme I ever seen this year. Amazing design, easy to customize and a design quality superlative account on its cloud platform for the optimized performance",
      name: "Courtney Henry",
      role: "Web Designer",
      avatarUrl: "/home/ubuntu/upload/image.png", // Replace with actual avatar path
    },
    {
      title: "Excellent Support",
      rating: 5,
      text: "The support team was incredibly helpful and responsive. They solved my issue within minutes! Highly recommend.",
      name: "John Doe",
      role: "Developer",
      avatarUrl: "/home/ubuntu/upload/image.png", // Replace with actual avatar path
    },
    {
      title: "Feature Rich",
      rating: 4,
      text: "Packed with features and very flexible. Took a little time to learn everything, but worth it.",
      name: "Jane Smith",
      role: "Project Manager",
      avatarUrl: "/home/ubuntu/upload/image.png", // Replace with actual avatar path
    },
  ];
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }) // Optional Autoplay
  );
  const includes =
    tour.inclus?.split(",").map((item: any) => item.trim()) || [];
  const excludes =
    tour.exclus?.split(",").map((item: any) => item.trim()) || [];

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
    <div>
      <div className="bg-[#F6F3F2] p-6 md:p-8 lg:p-12">
        {/* Breadcrumbs */}
        <nav className="mb-4 text-sm text-gray-500">
          <span className="text-red-600 hover:underline cursor-pointer">
            voyage
          </span>
          <span className="mx-2">&gt;</span>
          <span className="text-red-600 hover:underline cursor-pointer">
            maroc
          </span>
          <span className="mx-2">&gt;</span>
          <span>{tour.title}</span>
        </nav>

        <div className="flex flex-col-reverse lg:flex-row lg:gap-8 gap-4 items-center">
          {/* Colonne de gauche : Informations */}
          <div className="lg:w-1/2 lg:py-6">
            <p className="text-green-700 font-semibold mb-2">
              Maroc - Haut Atlas
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {tour.title}
            </h1>

            {/* Notation */}
            <div className="flex items-center mb-6">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} filled={i < rating} />
                ))}
              </div>
              <span className="text-gray-600 text-sm">
                ({reviewCount} Note)
              </span>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Description
              </h2>

              <SafeHTML
                html={tour.description || ""}
                className="text-gray-700 leading-relaxed"
              />
            </div>
          </div>

          {/* Colonne de droite : Image */}
          <div className="lg:w-1/2 h-full">
            <img
              src={tour.imageUrl || ""} // Remplacez par le chemin réel ou l'URL de votre image
              alt="Randonnée Atlas Central"
              className="rounded-lg shadow-md w-full h-auto object-cover"
              // Pour Next.js, utilisez <Image />
              // import Image from 'next/image';
              // <Image src="/path/to/your/image.jpg" alt="..." width={600} height={400} className="rounded-lg shadow-md" />
            />
          </div>
        </div>
      </div>
      <div className="bg-white">
        {/* Top Info Bar */}
        <div className="bg-[#83CD20] text-white  lg:px-24  grid grid-cols-1 lg:grid-cols-4 lg:gap-8 mb-4">
          <div className="flex items-center gap-2 bg-[#47663B] text-white px-8 py-8 rounded font-semibold justify-center">
            <img src={"/icons/money.png"} className="w-7 h-7" />{" "}
            {/* Replace with money icon */}
            <span>{tour.priceDiscounted}</span>
            <Link
              href={"#"}
              className="ml-2 bg-white text-slate-700 px-6 py-2 rounded-full  text-sm hover:bg-lime-700 transition-colors"
            >
              Réserver
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2 w-full lg:border-r-2 border-b-2 lg:border-b-0 py-4 border-white lg:my-4">
            <img src={"/icons/night-mode.png"} className="w-7 h-7" />{" "}
            {/* Replace with moon/duration icon */}
            <span>
              {tour.durationDays} Jours / {tour.durationNights} Nuités
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 w-full lg:border-r-2 border-b-2 lg:border-b-0 py-4 border-white lg:my-4">
            <img src={"/icons/map-pin.png"} className="w-7 h-7" />{" "}
            {/* Replace with location/pin icon */}
            <span>{tour.accommodationType}</span>
          </div>
          <div className="flex items-center gap-2 justify-center py-2">
            <img src={"/icons/calendar.png"} className="w-7 h-7" />{" "}
            {/* Replace with calendar icon */}
            <span>A partir de {getNextTourDate(tour.dates)}</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:py-4 py-2 px-2 lg:px-12 ">
          {/* Left Column (Video & Itinerary) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Section */}
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
                  src="https://www.youtube.com/embed/8hatQ0GNTZc"
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              {/* Add controls overlay if needed */}
            </div>

            {/* Itinerary Section */}
            <Accordion
              type="multiple"
              className="space-y-3"
              defaultValue={tour.programs.map((prog: Program) => prog.id)}
            >
              {tour.programs.map((prog: Program) => (
                <AccordionItem value={prog.id} key={prog.id}>
                  <AccordionTrigger className="bg-[#83CD20] rounded-t-lg cursor-pointer px-4 py-3 text-white">
                    {prog.title}
                  </AccordionTrigger>
                  <AccordionContent className=" p-2 border border-slate-200 shadow-xs rounded-b-lg ">
                    <div className="grid lg:grid-cols-3 grid-cols-1 p-4 gap-2">
                      <div className="col-span-2">
                        <SafeHTML html={prog.description || ""} />
                      </div>
                      <div className="col-span-1">
                        <img
                          src={prog.imageUrl || ""} // Remplacez par le chemin réel ou l'URL de votre image
                          alt="Randonnée Atlas Central"
                          className="rounded-lg shadow-md w-full h-auto object-cover"
                          // Pour Next.js, utilisez <Image />
                          // import Image from 'next/image';
                          // <Image src="/path/to/your/image.jpg" alt="..." width={600} height={400} className="rounded-lg shadow-md" />
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow border border-slate-200 p-4 space-y-4">
              <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
                Voyage
              </h3>

              {/* Detail Item */}
              <div className="flex items-center gap-3 border-b pb-3 justify-between">
                <div className="flex items-center gap-2">
                  <ChartNoAxesColumnDecreasing className="w-6 h-6 text-gray-400" />{" "}
                  {/* Replace with level icon */}
                  <span className="text-gray-600 font-medium w-24">Niveau</span>
                </div>

                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Construction
                      key={i}
                      className={
                        i < tour.difficultyLevel
                          ? "text-green-600"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Detail Item */}
              <div className="flex items-center gap-3 border-b pb-3 justify-between">
                <div className="flex items-center gap-2">
                  <Map className="w-6 h-6 text-gray-400" />{" "}
                  {/* Replace with destination icon */}
                  <span className="text-gray-600 font-medium w-24">
                    Distination
                  </span>
                </div>
                {tour.destinations.map((des: any, index: any) => (
                  <span className="text-gray-800" key={index}>
                    {des.name}
                  </span>
                ))}
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
                {tour.natures.map((des: any, index: any) => (
                  <span className="text-gray-800" key={index}>
                    {des.name}
                  </span>
                ))}
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
                <div className="flex items-center gap-2">
                  <Boxes className="w-6 h-6 text-gray-400" />{" "}
                  {/* Replace with services icon */}
                  <span className="text-gray-600 font-medium w-24">
                    Services
                  </span>
                </div>
                <span className="text-gray-800">
                  Vole A/R + Transferet +Guides
                </span>
              </div>

              {/* Reserve Button */}
              <button className="w-full bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-900 transition-colors mt-4">
                Réserver
              </button>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-2xl mx-auto font-sans">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-center">
                <MessageCircle />
                Les avis
              </h2>
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
                  {sampleTestimonials.map((review, index) => (
                    <CarouselItem
                      key={index}
                      className="md:basis-1/1 lg:basis-1/1"
                    >
                      {" "}
                      {/* Show 1 item at a time */}
                      <div className="p-1">
                        <TestimonialCard review={review} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-lime-400 hover:bg-lime-500 text-white border-none rounded-full w-8 h-8" />
                <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-lime-400 hover:bg-lime-500 text-white border-none rounded-full w-8 h-8" />
              </Carousel>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 lg:px-12 md:p-8 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Included Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Qu&apos;est-ce qui est inclus dans cet circuit?
            </h2>
            <p className="text-sm text-gray-500 mb-4 pb-2 border-b border-gray-200">
              Les éléments qui sont inclus dans le coût du prix de la tournée.
            </p>
            <ul className="list-none p-0 m-0">
              {includes.map((item: any, index: any) => (
                <div
                  key={`inc-${index}`}
                  className="flex items-center gap-2 mt-2"
                >
                  <BadgeCheck />
                  <p>{item}</p>
                </div>
              ))}
            </ul>
          </div>

          {/* Excluded Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Qu&apos;est-ce qui n&apos;est pas inclus dans cet circuit?
            </h2>
            <p className="text-sm text-gray-500 mb-4 pb-2 border-b border-gray-200">
              Les éléments qui ne sont pas inclus dans le coût du prix de la
              tournée.
            </p>
            <ul className="list-none p-0 m-0">
              {excludes.map((item: any, index: any) => (
                <div
                  key={`inc-${index}`}
                  className="flex items-center gap-2 mt-2"
                >
                  <BadgeX />
                  <p>{item}</p>
                </div>
              ))}
            </ul>
          </div>
        </div>
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
                {tour.priceDiscounted}
              </div>
              <div className="mt-2 md:mt-0">
                <button className="w-full md:w-auto bg-green-700 hover:bg-green-800 text-white text-sm font-semibold py-2 px-4 rounded-md flex items-center justify-center transition-colors">
                  Réserver
                  <ArrowRightIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white p-6 lg:px-12 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3 justify-center">
          <MapPinHouse />
          Localisation
        </h2>
        {/* Map Placeholder - Replace with actual map embed or component */}
        <div className="mb-3 rounded overflow-hidden border border-gray-200 w-full">
          <iframe
            className="w-full rounded-xl"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d51271.71670318516!2d-6.414428730714333!3d32.330897606129994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda38649419c7fc1%3A0x6236b3e9a12bafd9!2sB%C3%A9ni%20Mellal!5e1!3m2!1sfr!2sma!4v1749171732402!5m2!1sfr!2sma"
            width={600}
            height={450}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default TourDetails;

const StarIcon = (filled: any) => (
  <svg
    className={`w-5 h-5 ${filled.filled ? "text-yellow-400" : "text-gray-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const TestimonialCard = ({ review }: { review: any }) => {
  return (
    <Card className="mx-2 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <CardContent className="p-6 flex flex-col items-start text-left">
        <div className="flex justify-between items-center w-full mb-3">
          <h3 className="text-lg font-semibold text-orange-600">
            {review.title}
          </h3>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} filled={i < review.rating} />
            ))}
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          &quot;{review.text}&quot;
        </p>
        <div className="flex items-center mt-auto pt-4 border-t border-gray-100 w-full">
          <img
            src="/icons/user.png" // Replace with actual image path or use next/image
            alt={review.name}
            className="w-10 h-10 rounded-full mr-3 object-cover"
            // Example with next/image:
            // import Image from 'next/image';
            // <Image src={review.avatarUrl} alt={review.name} width={40} height={40} className="rounded-full mr-3" />
          />
          <div>
            <p className="font-semibold text-gray-800 text-sm">{review.name}</p>
            <p className="text-gray-500 text-xs">{review.role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
