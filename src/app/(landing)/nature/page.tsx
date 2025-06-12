/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import HeroSub from "../_components/hero-sub";
import { ToursDisplay } from "../_components/National";
import { NatureSearchAndViewControls } from "../_components/DisplayModeNature";

export default async function NatureToursPage(props: {
  searchParams: Promise<{
    natures?: string;
    search?: string;
    view?: "grid" | "carousel";
  }>;
}) {
   const searchParams = await props.searchParams;
  const natureId = searchParams.natures;
  const searchQuery = searchParams.search || "";
  const displayMode = searchParams.view === "carousel" ? "carousel" : "grid";
   // Fetch data
  const [sections, allNatures, tours] = await Promise.all([
    prisma.landing.findFirst({}),
    prisma.nature.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.tour.findMany({
      where: {
        ...(natureId && {
          natures: { some: { id: natureId } },
        }),
        ...(searchQuery && {
          title: { contains: searchQuery, mode: "insensitive" },
        }),
      },
      orderBy: { createdAt: "asc" },
      include: { natures: true, reviews: true },
    }),
  ]);

  // Handle 404 cases

  const NatureT = natureId
    ? await prisma.nature.findUnique({ where: { id: natureId } })
    : null;
  if (natureId && !NatureT) return notFound();

  // Breadcrumbs
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/nature", text: "Activité" },
    ...(NatureT
      ? [
          {
            href: `/nature?natures=${NatureT.id}`,
            text: NatureT.name,
          },
        ]
      : []),
  ];
    return (
        <div>
            <HeroSub
                title={`Activité - ${NatureT?.name}`}
                description={`Découvrez les voyages pour l'activité ${NatureT?.name}.`}
                breadcrumbLinks={breadcrumbLinks}
            />

            <NatureSearchAndViewControls
                natures={allNatures}
                currentNatureId={natureId}
            />
            <div>
                {tours.length === 0 ? (
                    <div className="text-center text-gray-500 text-lg lg:py-10">
                        Aucune excursion trouvée pour cette activité.
                    </div>
                ) : (
                    <ToursDisplay
                        tours={tours}
                        displayMode={displayMode}
                        title={false}
                    />
                )}
            </div>
        </div>
    );
}
