// app/destination/national/page.tsx
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import HeroSub from "../../_components/hero-sub";
import { SearchAndViewControls } from "../../_components/DisplayMode";
import { ToursDisplay } from "../../_components/National";

interface PageProps {
  searchParams: {
    destination?: string;
    search?: string;
    view?: 'grid' | 'carousel';
  };
}

export default async function NationalToursPage({ searchParams }: PageProps) {
  // Get query parameters
  const destinationId = searchParams.destination;
  const searchQuery = searchParams.search || '';
  const displayMode = searchParams.view === 'carousel' ? 'carousel' : 'grid';

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
          title: { contains: searchQuery, mode: 'insensitive' },
        }),
      },
      orderBy: { createdAt: "asc" },
      include: { destinations: true, reviews: true },
    }),
  ]);

  // Handle 404 cases
  if (destinationId && tours.length === 0) return notFound();
  
  const destination = destinationId
    ? await prisma.destination.findUnique({ where: { id: destinationId } })
    : null;
  if (destinationId && !destination) return notFound();

  // Breadcrumbs
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/destination/national", text: "National" },
    ...(destination ? [{
      href: `/destination/national?destination=${destination.id}`,
      text: destination.name,
    }] : []),
  ];

  return (
    <div>
      <HeroSub
        title={destination ? `Les voyages nationaux - ${destination.name}` : "Les voyages nationaux"}
        description={destination 
          ? `Découvrez les trésors cachés de ${destination.name}.`
          : "Découvrez les trésors cachés et les paysages spectaculaires de votre propre pays."}
        breadcrumbLinks={breadcrumbLinks}
      />

      <SearchAndViewControls
        destinations={allDestinations} 
        currentDestinationId={destinationId} 
      />

      {(sections?.national ?? true) && (
        <ToursDisplay
          tours={tours} 
          displayMode={displayMode}
          title={false}
        />
      )}
    </div>
  );
}