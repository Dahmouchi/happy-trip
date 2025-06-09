import { AddTourForm } from "@/app/admin/_components/add-tour-form";
import React from "react";
import { getInternationalDestinations, getNationalDestinations} from "@/actions/destinations";
import { getCategories } from "@/actions/categories";
import { getNatures } from "@/actions/natures";
import { getServices } from "@/actions/services";

export default async function AddTourPage() {
  const nationalDestinations = await getNationalDestinations();
  const internationalDestinations = await getInternationalDestinations();
  const categories = await getCategories();
  const natures = await getNatures();
  const services = await getServices();
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold ml-6">Ajouter un nouveau tour</h1>
      <AddTourForm nationalDestinations={nationalDestinations} internationalDestinations={internationalDestinations} categories={categories} natures={natures} services={services}/>
    </div>
  );
}