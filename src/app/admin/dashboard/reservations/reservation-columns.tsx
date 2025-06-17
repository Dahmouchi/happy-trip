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
import { Trash2 } from "lucide-react";
import { DeleteReservation, UpdateReservationStatus } from "@/actions/reservationsActions";
import { Hotel, Prisma, Reservation, ReservationStatus, TourDate } from "@prisma/client";
import { DateTime } from "aws-sdk/clients/devicefarm";
import { Float } from "aws-sdk/clients/batch";
// Replace with your actual reservation actions


type ReservationData = Reservation & {
    reservationDate: Date;
    tourTitle: string;
    hotel:Hotel;
    travelDate: TourDate;
    hotelName: string;
    hotelPrice: Float;
    startDate: DateTime;
    endDate: DateTime;
};


export const reservationColumns = ({ refresh, onEdit }: { refresh: () => void; onEdit?: (reservation: ReservationData) => void }): ColumnDef<ReservationData, unknown>[] => [
    {
        accessorKey: "seeAll",
        header: "Voir details",
        cell: ({ row }) => (
            <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit && onEdit(row.original)}
                aria-label="Voir les détails"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12s-4.5 7.5-10.5 7.5S1.5 12 1.5 12z" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} fill="none" />
                </svg>
            </Button>
        ),
    },
    
    {
        accessorKey: "tourTitle",
        header: "Titre du circuit",
        cell: ({ row }) => (<span>{row.getValue("tourTitle")}</span>),
    },
    {
        accessorKey: "fullName",
        header: "Nom du client",
        cell: ({ row }) => row.getValue("fullName"),
    },
    {
        accessorKey: "createdAt",
        header: "Date de réservation",
        cell: ({ row }) =>
            new Date(row.getValue("createdAt")).toLocaleDateString("fr-FR"),
    },
    {
        id: "hotelInfo",
        header: "Hôtel",
        cell: ({ row }) => {
            const hotel = row.original.hotel as { name?: string; price?: number };

            if (hotel?.name) {
            return (
                <span>
                {hotel.name}
                {hotel.price !== undefined && (
                    <span className="text-gray-500"> - {hotel.price} MAD</span>
                )}
                </span>
            );
            }

            return <span className="text-gray-500">Aucun hôtel</span>;
        },
    },
    {
        id: "travelDate",
        header: "Date de voyage",
        cell: ({ row }) => {
            const travelDate = row.original.travelDate as { startDate?: DateTime; endDate?: DateTime };
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
            accessorKey: "status",
            header: "Statut",
            cell: ({ row, table }) => {
            const [updating, setUpdating] = useState(false);
            const [localStatus, setLocalStatus] = useState(row.getValue("status") as ReservationStatus);
            const statusColors: Record<ReservationStatus, string> = {
                [ReservationStatus.PENDING]: "rounded-lg bg-yellow-200 text-yellow-800 p-1",
                [ReservationStatus.CONFIRMED]: "rounded-lg bg-green-200 text-green-800 p-1",
                [ReservationStatus.CANCELED]: "rounded-lg bg-red-200 text-red-800 p-1",
            };

            const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
                setUpdating(true);
                try {
                const newStatus = e.target.value as ReservationStatus;
                const response = await UpdateReservationStatus(row.original.id, newStatus);
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
                className={`px-2 py-1 rounded ${statusColors[localStatus]} ${updating ? "opacity-50" : ""}`}
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
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
            const reservationId = row.original.id;
            const [open, setOpen] = useState(false);

            const handleDelete = async () => {
                try {
                    const response = await DeleteReservation(reservationId);
                    if (response.success) {
                        toast.success("Réservation supprimée avec succès !");
                        refresh();
                    } else {
                        toast.error("Erreur lors de la suppression de la réservation");
                    }
                } catch (error) {
                    toast.error("Erreur inattendue");
                } finally {
                    setOpen(false);
                }
            };

            return (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit && onEdit(row.original)}
                        aria-label="Edit"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z" />
                        </svg>
                    </Button>
                    <AlertDialog open={open} onOpenChange={setOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" aria-label="Delete">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Cette action est irréversible. La réservation sera définitivement supprimée.
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
                </div>
            );
        },
    },
];
