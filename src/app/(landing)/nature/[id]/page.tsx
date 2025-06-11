import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import HeroSub from "../../_components/hero-sub";
import { ToursDisplay } from "../../_components/National";
import { NatureSearchAndViewControls } from "../../_components/DisplayModeNature";

export default async function NatureToursPage({
    params,
    searchParams,
}: {
    params: { id: string };
    searchParams: {
        search?: string;
        view?: "grid" | "carousel";
    };
}) {
    const natureId = params.id;
    const searchQuery = searchParams.search || "";
    const displayMode = searchParams.view === "carousel" ? "carousel" : "grid";

    // Fetch nature
    const nature = await prisma.nature.findUnique({
        where: { id: natureId },
    });
    if (!nature) return notFound();

    // Fetch all natures for filter controls (optional)
    const allNatures = await prisma.nature.findMany({
        orderBy: { name: "asc" },
    });

    // Fetch tours in this nature
    const tours = await prisma.tour.findMany({
        where: {
            natures: { some: { id: natureId } },
            ...(searchQuery && {
                title: { contains: searchQuery, mode: "insensitive" },
            }),
        },
        orderBy: { createdAt: "asc" },
        include: { natures: true, reviews: true },
    });

    // Breadcrumbs
    const breadcrumbLinks = [
        { href: "/", text: "Home" },
        { href: "/nature", text: "Activités" },
        { href: `/nature/${nature.id}`, text: nature.name },
    ];

    return (
        <div>
            <HeroSub
                title={`Voyages - ${nature.name}`}
                description={`Découvrez les voyages pour l'activité ${nature.name}.`}
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
