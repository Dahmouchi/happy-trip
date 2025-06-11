import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import HeroSub from "../../_components/hero-sub";
import { ToursDisplay } from "../../_components/National";
import { CategorySearchAndViewControls } from "../../_components/DisplayModeCategory";

export default async function CategoryToursPage({
    params,
    searchParams,
}: {
    params: { id: string };
    searchParams: {
        search?: string;
        view?: "grid" | "carousel";
    };
}) {
    const categoryId = params.id;
    const searchQuery = searchParams.search || "";
    const displayMode = searchParams.view === "carousel" ? "carousel" : "grid";

    // Fetch category
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
    });
    if (!category) return notFound();

    // Fetch all categories for filter controls (optional)
    const allCategories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });

    // Fetch tours in this category
    const tours = await prisma.tour.findMany({
        where: {
            categories: { some: { id: categoryId } },
            ...(searchQuery && {
                title: { contains: searchQuery, mode: "insensitive" },
            }),
        },
        orderBy: { createdAt: "asc" },
        include: { categories: true, reviews: true },
    });

    // Breadcrumbs
    const breadcrumbLinks = [
        { href: "/", text: "Home" },
        { href: "/category", text: "Catégories" },
        { href: `/category/${category.id}`, text: category.name },
    ];

    return (
        <div>
            <HeroSub
                title={`Voyages - ${category.name}`}
                description={`Découvrez les voyages pour la catégorie ${category.name}.`}
                breadcrumbLinks={breadcrumbLinks}
            />

            <CategorySearchAndViewControls
                categories={allCategories}
                currentCategoryId={categoryId}
            />
            <div>
                {tours.length === 0 ? (
                    <div className="text-center text-gray-500 text-lg lg:py-10">
                        Aucune excursion trouvée pour cette catégorie.
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
