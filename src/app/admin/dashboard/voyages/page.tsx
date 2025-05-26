import VoyagesComponent from "../../_components/voyages-form";

export default function VoyagesPage() {
  return (
    <div>
      <VoyagesComponent initialDestinations={[]} initialCategories={[]} initialNatures={[]} />
    </div>
  )
}