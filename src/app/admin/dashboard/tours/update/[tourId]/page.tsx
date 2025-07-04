import React from "react";
import { getTourById } from "@/actions/toursActions";
import { UpdateTourForm } from "@/app/admin/_components/update-tour-form";
import { getInternationalDestinations, getNationalDestinations } from "@/actions/destinations";
import { getCategories } from "@/actions/categories";
import { getNatures } from "@/actions/natures";
import { getServices } from "@/actions/services";
import { getHotels } from "@/actions/hotelsActions";

export default async function UpdateTourPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  // ⚠️ Await params before destructuring
  const { tourId } = await params;
  const result = await getTourById(tourId);
  const nationalDestinations = await getNationalDestinations();
  const internationalDestinations = await getInternationalDestinations();
  const categories = await getCategories();
  const natures = await getNatures();
  const services = await getServices();
  const hotels = await getHotels();
  if (!result.success) {
    return <div>Tour non trouvé</div>;
  }

  const tour = result.data;

  if (!tour) {
    return <div>Tour non trouvé</div>;
  }

  return (
    <div>
      <UpdateTourForm initialData={tour} nationalDestinations={nationalDestinations} internationalDestinations={internationalDestinations} categories={categories} natures={natures} services={services} hotels={hotels} tourId={tourId} ></UpdateTourForm>
    </div>
  );
}