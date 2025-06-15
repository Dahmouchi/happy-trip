/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Review } from "@prisma/client";
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
import { DeleteReview, UpdateReviewStatus } from "@/actions/reviewActions";

type ReviewData = Review & {
  tourTitle: string;
};

export const reviewColumns = ({ refresh }: { refresh: () => void }): ColumnDef<ReviewData, unknown>[] => [
  {
    accessorKey: "tourTitle",
    header: "Titre du circuit",
    cell: ({ row }) => <span>{row.getValue("tourTitle")}</span>,
  },
  {
    accessorKey: "rating",
    header: "Note",
    cell: ({ row }) => row.getValue("rating"),
  },
  {
    accessorKey: "message",
    header: "Commentaire",
    cell: ({ row }) => row.getValue("message"),
  },
  {
    accessorKey: "fullName",
    header: "Nom complet",
    cell: ({ row }) => row.getValue("fullName"),
  },
  {
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as boolean;
      const id = row.original.id;

      return (
        <select
          className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
            status ? "bg-lime-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
          value={status ? "published" : "unpublished"}
          onChange={async (e) => {
            const newStatus = e.target.value === "published";
            try {
              const response = await UpdateReviewStatus(id, newStatus);
              if (response.success) {
                toast.success("Statut mis à jour !");
                refresh();
              } else {
                toast.error("Erreur lors de la mise à jour du statut");
              }
            } catch (error) {
              toast.error("Erreur inattendue");
            }
          }}
        >
          <option value="published">Publié</option>
          <option value="unpublished">Non publié</option>
        </select>
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
          const response = await DeleteReview(reviewId);
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
                Cette action est irréversible. L’avis sera définitivement supprimé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}         
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
