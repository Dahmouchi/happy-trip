import prisma from "@/lib/prisma";
import HeroSub from "../_components/hero-sub";
import { CategorySearchAndViewControls } from "../_components/DisplayModeCategory";
import { ToursDisplay } from "../_components/National";

export default async function AllCategoriesPage({
  searchParams,
}: {
  searchParams: {
    search?: string;
    view?: "grid" | "carousel";
  };
}) {
  const searchQuery = searchParams.search || "";
  const displayMode = searchParams.view === "carousel" ? "carousel" : "grid";

  const [allCategories, tours] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.tour.findMany({
      where: {
        ...(searchQuery && {
          title: { contains: searchQuery, mode: "insensitive" },
        }),
      },
      orderBy: { createdAt: "asc" },
      include: { categories: true, reviews: true },
    }),
  ]);

  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/category", text: "Catégories" },
  ];

  return (
    <div>
      <HeroSub
        title="Tous les voyages"
        description="Explorez tous les voyages disponibles, toutes catégories confondues."
        breadcrumbLinks={breadcrumbLinks}
      />

      <CategorySearchAndViewControls
        categories={allCategories}
        currentCategoryId={undefined}
      />

      <div>
        {tours.length === 0 ? (
          <div className="text-center text-gray-500 text-lg lg:py-10">
            Aucun voyage trouvé.
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
