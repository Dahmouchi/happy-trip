/* eslint-disable @typescript-eslint/no-unused-vars */
 
'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { DataTable } from './tour-data-table';
import { tourColumns } from "./tour-columns";
import type { ColumnDef } from "@tanstack/react-table";
import { getAllTours } from "@/actions/toursActions";
import { Tour } from '@prisma/client';

type TourData = Tour & {
  destinations: { name: string }[];
  categories: { name: string }[];
  natures: { name: string }[];
  services: {name:string}[];
  programs: { title: string }[];
  images: { url: string }[];
};

export default function ReceptionPage() {
  const [tours, setTours] = useState<TourData[]>([]);

  const fetchTours = useCallback(async () => {
    const response = await getAllTours();
    if (response.success && Array.isArray(response.data)) {
      setTours(response.data as unknown as TourData[]);
    } else {
      console.error("Failed to fetch tours", response.error);
    }
  }, []);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Page de Réception</h1>
      <DataTable<TourData, unknown>
       columns={tourColumns({ refresh: fetchTours })}

        data={tours}
      />

    </div>
  );
}

