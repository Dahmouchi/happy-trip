/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import HeroSub from "../../_components/hero-sub";
import { Landing, Tour, Destination } from "@prisma/client";
import prisma from "@/lib/prisma";
import National from "../../_components/National";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    destination?: string[]; // For URL like `/destination/national/[destinationId]`
  };
}

const NationalTours = async ({ params }: PageProps) => {
  const destinationId = params.destination?.[0]; // Extract destinationId from URL

  const sections: Landing | null = await prisma.landing.findUnique({
    where: { id: "cmawhz4xm00000sh04egnpnpd" },
  });

  // Base query: Get all national tours (filtered by destination if provided)
  const whereClause: any = {
    type: "NATIONAL",
  };

  // If destinationId is provided, filter tours that include this destination
  if (destinationId) {
    whereClause.destinations = {
      some: {
        id: destinationId,
      },
    };
  }

  const tours: (Tour & { destinations: Destination[] })[] = await prisma.tour.findMany({
    where: whereClause,
    orderBy: { createdAt: "asc" },
    include: { destinations: true }, // Include destinations for display
  });

  // If filtering by destination but no tours found, return 404
  if (destinationId && tours.length === 0) {
    return notFound();
  }

  // Get destination details if filtering (for breadcrumbs & title)
  let destination: Destination | null = null;
  if (destinationId) {
    destination = await prisma.destination.findUnique({
      where: { id: destinationId },
    });
    if (!destination) return notFound(); // Invalid destinationId
  }

  // Breadcrumbs setup
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/destination/national", text: "National" },
  ];

  // Add destination to breadcrumbs if filtering
  if (destination) {
    breadcrumbLinks.push({
      href: `/destination/national/${destination.id}`,
      text: destination.name,
    });
  }

  return (
    <div>
      <HeroSub
        title={
          destination
            ? `Les voyages nationaux - ${destination.name}`
            : "Les voyages nationaux"
        }
        description={
          destination
            ? `Découvrez les trésors cachés de ${destination.name}.`
            : "Découvrez les trésors cachés et les paysages spectaculaires de votre propre pays. Des escapades en ville aux aventures en pleine nature, explorez les merveilles locales qui vous entourent."
        }
        breadcrumbLinks={breadcrumbLinks}
      />
      {(sections?.national ?? true) && <National tour={tours} />}
    </div>
  );
};

export default NationalTours;