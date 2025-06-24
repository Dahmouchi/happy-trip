/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { NewsLetter, Review } from "@prisma/client";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"; // adjust the import path if needed

import { ColumnDef } from "@tanstack/react-table";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import { DeleteNews, UpdateNewsStatus } from "@/actions/saveLandingConfig";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useRouter } from "next/navigation";

export const reviewColumns = ({
  refresh,
}: {
  refresh: () => void;
}): ColumnDef<any>[] => [
  {
    accessorKey: "nom",
    header: "Nom",
    cell: ({ row }) => <span>{row.getValue("nom")}</span>,
  },
  {
    accessorKey: "prenom",
    header: "Prenom",
    cell: ({ row }) => row.getValue("prenom"),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.getValue("email"),
  },
  {
    accessorKey: "message",
    header: "Commentaire",
    cell: ({ row }) => {
      return (
        <HoverCard>
          <HoverCardTrigger className="line-clamp-1">
            {row.getValue("message")}
          </HoverCardTrigger>
          <HoverCardContent>{row.getValue("message")}</HoverCardContent>
        </HoverCard>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
  {
    accessorKey: "statu",
    header: "Statut",
    cell: ({ row }) => {
      const statu = row.getValue("statu") as boolean;
      const id = row.original.id;
      const createdAt = new Date(row.original.createdAt); // Assuming you have createdAt in your data
      const router = useRouter();

      // Check if the record is less than 24 hours old
      const isNew = Date.now() - createdAt.getTime() < 24 * 60 * 60 * 1000;

      return (
        <div className="flex items-center gap-2">
        
          {isNew && (
            <span className="flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs text-blue-600">Nouveau</span>
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const reviewId = row.original.id;
      const [open, setOpen] = useState(false);

      const handleDelete = async () => {
        try {
          const response = await DeleteNews(reviewId);
          if (response.success) {
            toast.success("Avis supprimé avec succès !");
            refresh();
          } else {
            toast.error("Erreur lors de la suppression de l'avis");
          }
        } catch (error) {
          toast.error("Erreur inattendue");
        } finally {
          setOpen(false);
        }
      };

      return (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. L&apos;avis sera définitivement
                supprimé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
