 
import VoyagesComponent from "../../_components/voyages-form";
import { getDestinations } from "@/actions/destinations";
import { getCategories } from "@/actions/categories";  
import { getNatures } from "@/actions/natures";
import { getServices } from "@/actions/services";
import { getHotels } from "@/actions/hotelsActions";




export default async function VoyagesPage() {
  const rawDestinations = await getDestinations();
  const rawCategories = await getCategories();
  const rawNatures = await getNatures();
  const rawServices = await getServices();
  const rawHotels = await getHotels();

  return (
    <div>
      <VoyagesComponent initialDestinations={rawDestinations} initialCategories={rawCategories} initialNatures={rawNatures}  initialServices={rawServices} initialHotels={rawHotels}/>
    </div>
  )
}
