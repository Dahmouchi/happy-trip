 


import React from "react";
import { getTourById } from "@/actions/toursActions";
import { UpdateTourForm } from "@/app/admin/_components/update-tour-form";
import { getInternationalDestinations, getNationalDestinations } from "@/actions/destinations";
import { getCategories } from "@/actions/categories";
import { getNatures } from "@/actions/natures";

export default async function UpdateTourPage({ params }: { params: { tourId: string } }) {
  const result = await getTourById(params.tourId);
  const nationalDestinations = await getNationalDestinations();
  const internationalDestinations = await getInternationalDestinations();
  const categories = await getCategories();
  const natures = await getNatures();
  if (!result.success) {
    return <div>Tour non trouvé</div>;
  }

  const tour = result.data;

  if (!tour) {
    return <div>Tour non trouvé</div>;
  }

  return (
    <div>
      <UpdateTourForm initialData={tour} nationalDestinations={nationalDestinations} internationalDestinations={internationalDestinations} categories={categories} natures={natures} tourId={params.tourId} ></UpdateTourForm>
    </div>
  );
}
