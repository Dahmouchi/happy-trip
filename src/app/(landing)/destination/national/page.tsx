// app/destination/national/page.tsx
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import HeroSub from "../../_components/hero-sub";
import { SearchAndViewControls } from "../../_components/DisplayMode";
import { ToursDisplay } from "../../_components/National";


export default async function NationalToursPage(props: {
  searchParams: Promise<{
    destinations?: string;
    search?: string;
    view?: "grid" | "carousel";
  }>;
}) {
  const searchParams = await props.searchParams;

  const destinationId = searchParams.destinations;
  const searchQuery = searchParams.search || "";
  const displayMode = searchParams.view === "carousel" ? "carousel" : "grid";

  // Fetch data
  const [sections, allDestinations, tours] = await Promise.all([
    prisma.landing.findFirst({}),
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

  const destinationT = destinationId
    ? await prisma.destination.findUnique({ where: { id: destinationId } })
    : null;
  if (destinationId && !destinationT) return notFound();

  // Breadcrumbs
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/destination/national", text: "National" },
    ...(destinationT
      ? [
          {
            href: `/destination/national?destination=${destinationT.id}`,
            text: destinationT.name,
          },
        ]
      : []),
  ];

  return (
    <div>
      <HeroSub
        title={
          destinationT
            ? `Les voyages nationaux - ${destinationT.name}`
            : "Les voyages nationaux"
        }
        description={
          destinationT
            ? `Découvrez les trésors cachés de ${destinationT.name}.`
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
            <div className="text-center text-gray-500 text-lg lg:py-10">
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
