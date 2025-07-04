/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { ReservationDetails } from "./reservation-details-form";
import TourDetails from "@/app/(landing)/_components/ProductDetails";
import { ReservationEditForm } from "./reservation-edit-form";
import { sendEmailToClient } from "@/actions/meetingsActions";

type ReservationData = Reservation & {
  tourTitle: string;
  hotel: Hotel;
  tour: Tour;
  travelDate: TourDate;
  createdAt: Date;
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
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.getValue("email"),
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
        startDate?: Date;
        endDate?: Date;
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
      const totalPrice = row.getValue("finalPrice") as any;
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
      const formatDate = (date: Date | string | null | undefined) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      };
      const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUpdating(true);
        try {
          const newStatus = e.target.value as ReservationStatus;
          const response = await UpdateReservationStatus(
            row.original.id,
            newStatus
          );
          if (newStatus === "CONFIRMED") {
            await sendEmailToClient(
              row.getValue("email"),
              "Réservation chez Happy Trip",
              `<div style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: 0 auto;">
            <!-- Header with logo and color accent -->
            <div style="background-color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <img src="https://happytrip.ma/wp-content/uploads/2016/04/cropped-PNG-Final-Logo-1.png" alt="Happy Trip Logo" style="max-height: 80px; display: block; margin: 0 auto;">
            </div>
            
            <!-- Email content -->
            <div style="padding: 20px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <h2 style="color: #8EBD22; margin-top: 0;">Bonjour ${row.getValue("nom")},</h2>
              <p style="font-size: 16px; line-height: 1.5;">
                Nous avons le plaisir de vous confirmer votre réservation chez <strong>Happy Trip</strong> !
              </p>
              
              <!-- Reservation details card -->
              <div style="margin: 20px 0; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #8EBD22;">
                <h3 style="color: #8EBD22; margin-top: 0; margin-bottom: 12px;">Détails de votre réservation</h3>
                
                <p style="margin: 8px 0;"><strong>🔹 Référence :</strong> ${row.original.id}</p>
                <p style="margin: 8px 0;"><strong>🔹 Circuit :</strong> ${row.original.tour.title}</p>
                <p style="margin: 8px 0;"><strong>🔹 Dates :</strong> Du ${formatDate(row.original.travelDate.startDate)} au ${formatDate(row.original.travelDate.endDate)}</p>
                <p style="margin: 8px 0;"><strong>🔹 Montant total :</strong> ${row.getValue("finalPrice")} MAD</p>
              </div>
              
              <!-- Next steps -->
              <div style="margin: 20px 0;">
                <h4 style="color: #8EBD22; margin-bottom: 8px;">Prochaines étapes :</h4>
                <ul style="padding-left: 20px; margin-top: 0;">
                  <li>Vous recevrez un email avec votre itinéraire détaillé sous 48 heures</li>
                  <li>Paiement à effectuer avant le ${formatDate(new Date(row.original.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000))}</li>
                  <li>Préparez vos documents de voyage (passeport, etc.)</li>
                </ul>
              </div>
              
              <!-- Contact information -->
              <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; margin-top: 24px;">
                <p style="margin: 0;">Pour toute question, contactez-nous :</p>
                <p style="margin: 8px 0 0 0;">
                  📞 <a href="tel:+212522123456" style="color: #8EBD22; text-decoration: none;">+212 522 123 456</a> | 
                  ✉️ <a href="mailto:contact@happytrip.com" style="color: #8EBD22; text-decoration: none;">contact@happytrip.com</a>
                </p>
              </div>
              
              <!-- Signature -->
              <p style="margin-top: 24px; font-size: 15px;">
                Cordialement,<br>
                <strong style="color: #8EBD22;">L'équipe Happy Trip</strong><br>
                <span style="font-size: 13px; color: #64748b;">Votre partenaire de voyage de confiance</span>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding: 16px; color: #64748b; font-size: 12px;">
              <p style="margin: 0;">© ${new Date().getFullYear()} Happy Trip. Tous droits réservés.</p>
              <p style="margin: 8px 0 0 0;">
                <a href="https://happytrip.com" style="color: #8EBD22; text-decoration: none;">Visitez notre site</a> | 
                <a href="https://happytrip.com/conditions" style="color: #8EBD22; text-decoration: none;">Conditions générales</a>
              </p>
            </div>
          </div>
          `
            );
          } else if (newStatus === "CANCELED") {
            await sendEmailToClient(
              row.getValue("email"),
              "Réservation chez Happy Trip",
              `<div style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: 0 auto;">
  <!-- Header with logo and color accent -->
  <div style="background-color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <img src="https://happytrip.ma/wp-content/uploads/2016/04/cropped-PNG-Final-Logo-1.png" alt="Happy Trip Logo" style="max-height: 80px; display: block; margin: 0 auto;">
  </div>
  
  <!-- Email content -->
  <div style="padding: 20px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #8EBD22; margin-top: 0;">Bonjour ${row.getValue("nom")},</h2>
    <p style="font-size: 16px; line-height: 1.5;">
      Nous vous informons avec regret que votre réservation chez <strong>Happy Trip</strong> a dû être annulée.
    </p>
    
    <!-- Reservation details card -->
    <div style="margin: 20px 0; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #8EBD22;">
      <h3 style="color: #8EBD22; margin-top: 0; margin-bottom: 12px;">Détails de la réservation annulée</h3>
      
      <p style="margin: 8px 0;"><strong>🔹 Référence :</strong> ${row.original.id}</p>
      <p style="margin: 8px 0;"><strong>🔹 Circuit :</strong> ${row.original.tour.title}</p>
      <p style="margin: 8px 0;"><strong>🔹 Dates prévues :</strong> Du ${formatDate(row.original.travelDate.startDate)} au ${formatDate(row.original.travelDate.endDate)}</p>
      <p style="margin: 8px 0;"><strong>🔹 Montant :</strong> ${row.original.totalPrice} MAD</p>
    </div>
    
    <!-- Refund information -->
    <div style="margin: 20px 0;">
      <h4 style="color: #8EBD22; margin-bottom: 8px;">Remboursement :</h4>
      <ul style="padding-left: 20px; margin-top: 0;">
        <li>Le remboursement sera traité dans les 5 à 10 jours ouvrables</li>
        <li>Vous recevrez une confirmation par email une fois le remboursement effectué</li>
        <li>Pour toute question, contactez-nous via les coordonnées ci-dessous</li>
      </ul>
    </div>
    
    <!-- Alternative options -->
    <div style="background-color: #fff8f1; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
      <h4 style="color: #d97706; margin-top: 0;">Nous vous proposons :</h4>
      <ul style="padding-left: 20px; margin-bottom: 0;">
        <li>Une recréation de votre réservation avec des dates alternatives</li>
        <li>Un crédit voyage valable 12 mois</li>
        <li>Des offres spéciales pour votre prochain voyage</li>
      </ul>
    </div>
    
    <!-- Contact information -->
    <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; margin-top: 24px;">
      <p style="margin: 0;">Pour toute question ou réorganisation :</p>
      <p style="margin: 8px 0 0 0;">
        📞 <a href="tel:+212522123456" style="color: #8EBD22; text-decoration: none;">+212 522 123 456</a> | 
        ✉️ <a href="mailto:contact@happytrip.com" style="color: #8EBD22; text-decoration: none;">contact@happytrip.com</a>
      </p>
    </div>
    
    <!-- Signature -->
    <p style="margin-top: 24px; font-size: 15px;">
      Cordialement,<br>
      <strong style="color: #8EBD22;">L'équipe Happy Trip</strong><br>
      <span style="font-size: 13px; color: #64748b;">Nous sommes désolés pour ce contretemps et espérons vous servir à nouveau</span>
    </p>
  </div>
  
  <!-- Footer -->
  <div style="text-align: center; padding: 16px; color: #64748b; font-size: 12px;">
    <p style="margin: 0;">© ${new Date().getFullYear()} Happy Trip. Tous droits réservés.</p>
    <p style="margin: 8px 0 0 0;">
      <a href="https://happytrip.com" style="color: #8EBD22; text-decoration: none;">Visitez notre site</a> | 
      <a href="https://happytrip.com/conditions" style="color: #8EBD22; text-decoration: none;">Conditions d'annulation</a>
    </p>
  </div>
</div>
          `
            );
          }
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
