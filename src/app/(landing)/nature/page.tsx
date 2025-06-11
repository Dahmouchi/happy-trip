import prisma from "@/lib/prisma";
import HeroSub from "../_components/hero-sub";
import { ToursDisplay } from "../_components/National";
import { NatureSearchAndViewControls } from "../_components/DisplayModeNature";

export default async function AllNaturesPage({
    searchParams,
}: {
    searchParams: {
        search?: string;
        view?: "grid" | "carousel";
    };
}) {
    const searchQuery = searchParams.search || "";
    const displayMode = searchParams.view === "carousel" ? "carousel" : "grid";

    // Fetch all natures
    const allNatures = await prisma.nature.findMany({
        orderBy: { name: "asc" },
    });

    // Fetch all tours (optionally filtered by search)
    const tours = await prisma.tour.findMany({
        where: {
            ...(searchQuery && {
                title: { contains: searchQuery, mode: "insensitive" },
            }),
        },
        orderBy: { createdAt: "asc" },
        include: { natures: true, reviews: true },
    });

    // Breadcrumb
    const breadcrumbLinks = [
        { href: "/", text: "Home" },
        { href: "/nature", text: "activités" },
    ];

    return (
        <div>
            <HeroSub
                title="Tous les voyages"
                description="Explorez tous les voyages disponibles, toutes activités confondues."
                breadcrumbLinks={breadcrumbLinks}
            />

            <NatureSearchAndViewControls
                natures={allNatures}
                currentNatureId={undefined}
            />

            <div>
                {tours.length === 0 ? (
                    <div className="text-center text-gray-500 text-lg lg:py-10">
                        Aucunne activité trouvé.
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
