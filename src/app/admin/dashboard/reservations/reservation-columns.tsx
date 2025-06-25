/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "react-toastify";
import { Pencil, Trash2, X } from "lucide-react";
import {
  DeleteReservation,
  UpdateReservationStatus,
} from "@/actions/reservationsActions";
import {
  Hotel,
  Prisma,
  Reservation,
  ReservationStatus,
  Tour,
  TourDate,
} from "@prisma/client";
import { DateTime } from "aws-sdk/clients/devicefarm";
import { Float } from "aws-sdk/clients/batch";
import { ReservationDetails } from "./reservation-details-form";
import TourDetails from "@/app/(landing)/_components/ProductDetails";
import { ReservationEditForm } from "./reservation-edit-form";

type ReservationData = Reservation & {
  tourTitle: string;
  hotel: Hotel;
  tour: Tour;
  travelDate: TourDate;
  createdAt: DateTime;
};

export const reservationColumns = ({
  refresh,
  onEdit,
}: {
  refresh: () => void;
  onEdit?: (reservation: ReservationData) => void;
}): ColumnDef<ReservationData, unknown>[] => [
  {
    accessorKey: "nom",
    header: "Nom",
    cell: ({ row }) => {
      const title = row.getValue("nom") as string;
      return (
        <span>{title.length > 15 ? `${title.slice(0, 17)}...` : title}</span>
      );
    },
  },
  {
    accessorKey: "prenom",
    header: "Nom du client",
    cell: ({ row }) => row.getValue("prenom"),
  },
  {
    accessorKey: "createdAt",
    header: "Date de réservation",
    cell: ({ row }) =>
      new Date(row.getValue("createdAt")).toLocaleDateString("fr-FR"),
  },

  {
    id: "travelDate",
    header: "Date de voyage",
    cell: ({ row }) => {
      const travelDate = row.original.travelDate as {
        startDate?: DateTime;
        endDate?: DateTime;
      };
      if (travelDate?.startDate && travelDate?.endDate) {
        return (
          <span>
            {new Date(travelDate.startDate).toLocaleDateString("fr-FR")} -{" "}
            {new Date(travelDate.endDate).toLocaleDateString("fr-FR")}
          </span>
        );
      }
      return <span className="text-gray-500">Aucune date de voyage</span>;
    },
  },
  {
    accessorKey: "finalPrice",
    header: "Prix total",
    cell: ({ row }) => {
      const totalPrice = row.getValue("finalPrice") as Float;
      return (
        <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-semibold">
          {totalPrice.toLocaleString("fr-FR", {
            style: "currency",
            currency: "MAD",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row, table }) => {
      const [updating, setUpdating] = useState(false);
      const [localStatus, setLocalStatus] = useState(
        row.getValue("status") as ReservationStatus
      );
      const statusColors: Record<ReservationStatus, string> = {
        [ReservationStatus.PENDING]:
          "rounded-lg bg-yellow-200 text-yellow-800 p-1",
        [ReservationStatus.CONFIRMED]:
          "rounded-lg bg-green-200 text-green-800 p-1",
        [ReservationStatus.CANCELED]: "rounded-lg bg-red-200 text-red-800 p-1",
      };

      const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUpdating(true);
        try {
          const newStatus = e.target.value as ReservationStatus;
          const response = await UpdateReservationStatus(
            row.original.id,
            newStatus
          );
          if (response.success) {
            toast.success("Statut mis à jour !");
            setLocalStatus(newStatus);
            row.original.status = newStatus;
          } else {
            toast.error("Erreur lors de la mise à jour du statut");
          }
        } catch (error) {
          toast.error("Erreur inattendue");
        } finally {
          setUpdating(false);
        }
      };

      return (
        <select
          className={`px-2 py-1 rounded ${statusColors[localStatus]} ${
            updating ? "opacity-50" : ""
          }`}
          value={localStatus}
          onChange={handleChange}
          disabled={updating}
        >
          <option value={ReservationStatus.PENDING}>En attente</option>
          <option value={ReservationStatus.CONFIRMED}>Confirmée</option>
          <option value={ReservationStatus.CANCELED}>Annulée</option>
        </select>
      );
    },
  },
  {
    accessorKey: "seeAll",
    header: "Voir détails",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);

      return (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Voir les détails"
              className="flex items-center justify-center w-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12s-4.5 7.5-10.5 7.5S1.5 12 1.5 12z"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  strokeWidth={2}
                  fill="none"
                />
              </svg>
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="w-full max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto p-4 rounded-lg">
            <div className="absolute right-4 top-4">
              <AlertDialogCancel className="p-1 h-auto w-auto border-none bg-transparent  hover:bg-gray-200">
                <X className="h-5 w-5" />
              </AlertDialogCancel>
            </div>

            <AlertDialogHeader className="mt-6">
              <AlertDialogTitle>Résévation détails</AlertDialogTitle>
            </AlertDialogHeader>

            <div className="p-2">
              <ReservationDetails reservation={row.original} />
            </div>
             <AlertDialogFooter className="mt-4">
              <AlertDialogCancel>Fermer</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
