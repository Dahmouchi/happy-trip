/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { getTourById } from "@/actions/toursActions";
import { UpdateTourForm } from "@/app/admin/_components/update-tour-form";
import { getInternationalDestinations, getNationalDestinations } from "@/actions/destinations";
import { getCategories } from "@/actions/categories";
import { getNatures } from "@/actions/natures";

export default async function UpdateTourPage(params:any) {
  const result = await getTourById(params.params.tourId);
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
      <UpdateTourForm initialData={tour} nationalDestinations={nationalDestinations} internationalDestinations={internationalDestinations} categories={categories} natures={natures} tourId={params.params.tourId} ></UpdateTourForm>
    </div>
  );
}
