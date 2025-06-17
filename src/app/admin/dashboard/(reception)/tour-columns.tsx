/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import React from "react";
import { deleteTour } from "@/actions/toursActions";
import { Button } from "@/components/ui/button";
import { Tour } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "react-toastify";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

type TourData = Tour & {
  destinations: { name: string }[];
  categories: { name: string }[];
  natures: { name: string }[];
  services: { name: string }[];
  programs: { title: string }[];
  images: { url: string }[];
};

export const tourColumns = ({ refresh }: { refresh: () => void }): ColumnDef<TourData, unknown>[] => [
  { accessorKey: "title", header: "Titre", cell: ({ row }) => row.getValue("title") ?? "—" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "priceOriginal", header: "Prix d'origine", cell: ({ row }) => `${row.getValue("priceOriginal") ?? "—"} MAD` },
  { accessorKey: "advancedPrice", header: "Acompte", cell: ({ row }) => row.getValue("advancedPrice") ?? "—" },
  { accessorKey: "dateCard", header: "Date (carte)", cell: ({ row }) => row.getValue("dateCard") ?? "—" },
  { accessorKey: "durationDays", header: "Jours", cell: ({ row }) => row.getValue("durationDays") ?? "—" },
  { accessorKey: "accommodationType", header: "Hébergement", cell: ({ row }) => row.getValue("accommodationType") ?? "—" },
  {
    id: "actions",
    cell: ({ row }) => {
      // Use a React state to control AlertDialog open state
      const [open, setOpen] = React.useState(false);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="bg-white p-2 rounded-xl border-2 border-gray-300 z-50 shadow-lg">
            <DropdownMenuLabel className="p-2 text-gray-500 font-bold">Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="p-2 font-medium rounded hover:bg-gray-100 hover:cursor-pointer focus-visible:outline-0"
              onSelect={() => {
                window.location.href = `/admin/dashboard/tours/update/${row.original.id}`;
              }}
            >
              Voir détails / Modifier
            </DropdownMenuItem>

            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="p-2 font-medium rounded text-red-600 hover:bg-gray-100 hover:cursor-pointer focus-visible:outline-0"
                  onSelect={e => {
                    // Prevent DropdownMenu from closing before AlertDialog opens
                    e.preventDefault();
                    setOpen(true);
                  }}
                >
                  Supprimer
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce tour ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Le tour sera définitivement supprimé de la base de données.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setOpen(false)}>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    onClick={async () => {
                      try {
                        const result = await deleteTour(row.original.id);
                        if (!result.success) {
                          throw new Error("Échec de la suppression du tour");
                        }
                        toast.success("Tour supprimé avec succès");
                        setOpen(false);
                        refresh();
                      } catch (error) {
                        toast.error(`Échec de la suppression du tour : ${String(error)}`);
                        setOpen(false);
                      }
                    }}
                  >
                    Supprimer définitivement
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
