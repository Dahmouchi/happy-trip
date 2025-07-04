// app/destination/international/page.tsx
import { SearchAndViewControls } from "@/app/(landing)/_components/DisplayMode";
import HeroSub from "@/app/(landing)/_components/hero-sub";
import { ToursDisplay } from "@/app/(landing)/_components/National";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";


export default async function InternationalToursPage(props: {
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
      where: { type: "INTERNATIONAL" },
      orderBy: { name: "asc" },
    }),
    prisma.tour.findMany({
      where: {
        type: "INTERNATIONAL",
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
    { href: "/destination/international", text: "international" },
    ...(destinationT
      ? [
          {
            href: `/destination/international?destination=${destinationT.id}`,
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
            ? `Les voyages internationaux - ${destinationT.name}`
            : "Les voyages internationaux"
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
      {(sections?.international ?? true) && (
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
