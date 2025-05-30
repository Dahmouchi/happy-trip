/* eslint-disable @typescript-eslint/no-explicit-any */
import VoyagesComponent from "../../_components/voyages-form";
import { getDestinations } from "@/actions/destinations";
import { getCategories } from "@/actions/categories";  
import { getNatures } from "@/actions/natures";




export default async function VoyagesPage() {
  const rawDestinations = await getDestinations();
  const rawCategories = await getCategories();
  const rawNatures = await getNatures();

  return (
    <div>
      <VoyagesComponent initialDestinations={rawDestinations} initialCategories={rawCategories} initialNatures={rawNatures} />
    </div>
  )
}