// components/DestinationFilter.tsx
"use client";

import { useRouter } from "next/navigation";

export default function DestinationFilter({
  destinations,
  currentDestinationId,
}: {
  destinations: { id: string; name: string }[];
  currentDestinationId?: string;
}) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (selectedId) {
      router.push(`/destination/national?destination=${selectedId}`);
    } else {
      router.push("/destination/national");
    }
  };

  return (
    <div className="max-w-md">
      <label htmlFor="destination-filter" className="block text-sm font-medium mb-1">
        Filtrer par destination:
      </label>
      <select
        id="destination-filter"
        className="block w-full rounded-md border-gray-300 bg-[#8ebd21] text-white py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500"
        value={currentDestinationId || ""}
        onChange={handleChange}
      >
        <option value="">Toutes les destinations</option>
        {destinations.map((dest) => (
          <option key={dest.id} value={dest.id}>
            {dest.name}
          </option>
        ))}
      </select>
    </div>
  );
}