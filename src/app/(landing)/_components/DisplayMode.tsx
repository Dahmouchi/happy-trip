// components/SearchAndViewControls.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { GalleryHorizontalEnd, LayoutGrid, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchAndViewControls({
  destinations,
  currentDestinationId,
}: {
  destinations: { id: string; name: string }[];
  currentDestinationId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [displayMode, setDisplayMode] = useState<"grid" | "carousel">(
    (searchParams.get("view") as "grid" | "carousel") || "grid"
  );

  // Update URL when search or view changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }

    if (displayMode !== "grid") {
      params.set("view", displayMode);
    } else {
      params.delete("view");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [searchQuery, displayMode, searchParams, router, pathname]);

  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (selectedId) {
      params.set("destinations", selectedId);
    } else {
      params.delete("destinations");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="sticky top-0 z-10 bg-[#8ebd21] backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
          {/* Search and Filter Section */}

          <div className="w-full md:w-auto flex-1">
            <div className="flex lg:items-center justify-between flex-col lg:flex-row gap-2">
              {/* Search Input */}
              <div>
                <label
                  htmlFor="destination-filter"
                  className="block text-sm font-medium text-gray-700 mb-1 sr-only"
                >
                  Filtrer par destination
                </label>
                <select
                  id="destination-filter"
                  className="block w-full rounded-md border bg-white border-gray-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500"
                  value={currentDestinationId || ""}
                  onChange={handleDestinationChange}
                >
                  <option value="">Toutes les destinations</option>
                  {destinations.map((dest) => (
                    <option key={dest.id} value={dest.id}>
                      {dest.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Filter */}
              <div className=" flex items-center gap-2">
                <div className="md:col-span-1">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Rechercher des tours..."
                      className="pl-10 bg-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* View Toggle */}
                <div className="md:col-span-1 flex items-center gap-2">
                  <div className="inline-flex rounded-md shadow-sm">
                    <Button
                      variant={displayMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDisplayMode("grid")}
                      className="rounded-r-none"
                    >
                      <LayoutGrid />
                    </Button>
                    <Button
                      variant={
                        displayMode === "carousel" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setDisplayMode("carousel")}
                      className="rounded-l-none"
                    >
                      <GalleryHorizontalEnd />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
