"use client"

import { Button } from "@/components/ui/button";
import { Tour } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table"
import {  MoreHorizontal } from "lucide-react";


export const tourColumns: ColumnDef<Tour>[] = [
  { accessorKey: "title", header: "Titre" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "priceOriginal", header: "Prix d'origine", cell: ({ row }) => `${row.getValue("priceOriginal") ?? "—"} MAD` },
  { accessorKey: "priceDiscounted", header: "Prix remisé", cell: ({ row }) => `${row.getValue("priceDiscounted") ?? "—"} MAD` },
  { accessorKey: "advancedPrice", header: "Acompte", cell: ({ row }) => row.getValue("advancedPrice") ?? "—" },
  { accessorKey: "dateCard", header: "Date (carte)", cell: ({ row }) => row.getValue("dateCard") ?? "—" },
  { accessorKey: "durationDays", header: "Jours", cell: ({ row }) => row.getValue("durationDays") ?? "—" },
  { accessorKey: "accommodationType", header: "Hébergement", cell: ({ row }) => row.getValue("accommodationType") ?? "—" },
  {
    id: "actions",
    cell: ({ }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-50 p-4 rounded-xl border-gray-300">
            <DropdownMenuLabel className="text-gray-500 font-bold">Actions</DropdownMenuLabel>
            <DropdownMenuItem className="py-2 font-medium hover:font-bold text-gray-600 hover:cursor-pointer focus-visible:outline-0">
              Voir détails / Modifier
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2 font-medium hover:font-bold text-gray-600 hover:cursor-pointer focus-visible:outline-0">
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];
