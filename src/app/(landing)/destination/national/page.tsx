/* eslint-disable @typescript-eslint/no-explicit-any */
// app/destination/national/page.tsx
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import HeroSub from "../../_components/hero-sub";
import { SearchAndViewControls } from "../../_components/DisplayMode";
import { ToursDisplay } from "../../_components/National";



export default async function NationalToursPage(destinations?: any,search?: any,view?: any) {
  // Get query parameters
  const destinationId = destinations?.destination;
  const searchQuery = search?.search || "";
  const displayMode = view?.view === "carousel" ? "carousel" : "grid";

  // Fetch data
  const [sections, allDestinations, tours] = await Promise.all([
    prisma.landing.findUnique({ where: { id: "cmawhz4xm00000sh04egnpnpd" } }),
    prisma.destination.findMany({
      where: { type: "NATIONAL" },
      orderBy: { name: "asc" },
    }),
    prisma.tour.findMany({
      where: {
        type: "NATIONAL",
        ...(destinationId && {
          destinations: { some: { id: destinationId } },
        }),
        ...(searchQuery && {
          title: { contains: searchQuery, mode: "insensitive" },
        }),
      },
      orderBy: { createdAt: "asc" },
      include: { destinations: true, reviews: true },
    }),
  ]);

  // Handle 404 cases

  const destination = destinationId
    ? await prisma.destination.findUnique({ where: { id: destinationId } })
    : null;
  if (destinationId && !destination) return notFound();

  // Breadcrumbs
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/destination/national", text: "National" },
    ...(destination
      ? [
          {
            href: `/destination/national?destination=${destination.id}`,
            text: destination.name,
          },
        ]
      : []),
  ];

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
            : "Découvrez les trésors cachés et les paysages spectaculaires de votre propre pays."
        }
        breadcrumbLinks={breadcrumbLinks}
      />

      <SearchAndViewControls
        destinations={allDestinations}
        currentDestinationId={destinationId}
      />

      {(sections?.national ?? true) && (
        <div>
          {tours.length === 0 ? (
            <div className="text-center text-gray-500 text-lg py-10">
              Aucune excursion trouvée pour cette destination.
            </div>
          ) : (
            <ToursDisplay
              tours={tours}
              displayMode={displayMode}
              title={false}
            />
          )}
        </div>
      )}
    </div>
  );
}
