/* eslint-disable @typescript-eslint/no-unused-vars */

import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ToursDisplay } from "../_components/National";
import { CategorySearchAndViewControls } from "../_components/DisplayModeCategory";
import HeroSub from "../_components/hero-sub";

export default async function CategoryToursPage(props: {
  searchParams: Promise<{
    categorys?: string;
    search?: string;
    view?: "grid" | "carousel";
  }>;
}) {
   const searchParams = await props.searchParams;
  const categoryId = searchParams.categorys;
  const searchQuery = searchParams.search || "";
  const displayMode = searchParams.view === "carousel" ? "carousel" : "grid";
  // Fetch data
  const [sections, allCategories, tours] = await Promise.all([
    prisma.landing.findFirst({}),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.tour.findMany({
      where: {
        ...(categoryId && {
          categories: { some: { id: categoryId } },
        }),
        ...(searchQuery && {
          title: { contains: searchQuery, mode: "insensitive" },
        }),
      },
      orderBy: { createdAt: "asc" },
      include: { categories: true, reviews: true },
    }),
  ]);

  // Handle 404 cases

  const categoryT = categoryId
    ? await prisma.category.findUnique({ where: { id: categoryId } })
    : null;
  if (categoryId && !categoryT) return notFound();

  // Breadcrumbs
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/category/national", text: "National" },
    ...(categoryT
      ? [
          {
            href: `/category?categorys=${categoryT.id}`,
            text: categoryT.name,
          },
        ]
      : []),
  ];
  return (
    <div>
      <HeroSub
        title={`Voyages - ${categoryT?.name}`}
        description={`Découvrez les voyages pour la catégorie ${categoryT?.name}.`}
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
          <ToursDisplay tours={tours} displayMode={displayMode} title={false} />
        )}
      </div>
    </div>
  );
}
