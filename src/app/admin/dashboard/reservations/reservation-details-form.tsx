/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Baby,
  Bed,
  DollarSign,
  Building2,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings,
  Info,
} from "lucide-react";
import { Hotel, Tour, TourDate } from "@prisma/client";
import { StatusBadge } from "@/components/ui/status-badge";

// Simplified types for the component (removing AWS SDK dependencies)
type ReservationDetailsProps = {
  reservation: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    phone: string;
    tourTitle: string;
    adultCount: number;
    childCount: number;
    infantCount: number;
    singleRoom: boolean;
    totalPrice: number;
    specialRequests?: string | null;
    status: string;
    createdAt: Date;
    travelDate: TourDate;
    hotel?: Hotel;
    tour: Tour;
  };
};

const DetailRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-gray-500" />
      <span className="font-medium text-gray-600">{label}</span>
    </div>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);
const DetailRowI = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-3">
      <Info className="w-4 h-4 text-gray-500" />
      <span className="font-medium text-gray-600">{label}</span>
    </div>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);
export const ReservationDetails: React.FC<any> = ({ reservation }) => {
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card
      className="w-full  mx-auto border-none shadow-none bg-gradient-to-br from-white to-gray-50 px-2 sm:px-4 lg:px-8"
      onClick={() => console.log(reservation)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            Détails de la réservation
          </CardTitle>
        </div>
        <div className="flex items-center justify-between mt-2">
          <StatusBadge status={reservation.status} />
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500 mt-2">
            Réservé le {formatDate(reservation.createdAt)}
          </p>
          <p className="text-sm text-gray-500">
            ID de la réservation:{" "}
            <span className="font-semibold">{reservation.id}</span>
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Personal Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Informations personnelles
          </h3>
          <div className="bg-white rounded-lg p-4 space-y-1 border border-gray-100">
            <DetailRow
              icon={User}
              label="Nom complet"
              value={reservation.nom + " " + reservation.prenom}
            />
            <DetailRow icon={Mail} label="Email" value={reservation.email} />
            <DetailRow
              icon={Phone}
              label="Téléphone"
              value={reservation.phone}
            />
          </div>
        </div>

        <Separator />

        {/* Tour Information Section */}
        <div>
          <div className="bg-white rounded-lg p-4 space-y-1 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Détails du voyage
            </h3>
            <div className="bg-white rounded-lg p-4 space-y-1 border border-gray-100">
              <DetailRow
                icon={MapPin}
                label="Titre de tour"
                value={reservation.tour.title}
              />
              <DetailRow
                icon={Calendar}
                label=" Période de voyage"
                value={`de ${formatDate(
                  reservation.travelDate?.startDate
                )} à ${formatDate(reservation.travelDate?.endDate)}`}
              />
            </div>
          </div>
        </div>

        <Separator />
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-600" />
            Informations supplémentaires
          </h3>
          <div className="bg-white rounded-lg p-4 space-y-1 border border-gray-100">
            {reservation.data &&
              Object.entries(reservation.data).map(([key, value]) => (
                <DetailRowI key={key} label={key} value={String(value)} />
              ))}
          </div>
        </div>
        <Separator />

        {/* Pricing Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Prix
          </h3>
          <div className="bg-white rounded-lg p-4 space-y-1 border border-gray-100 text-sm text-gray-700">
            <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Prix de base</span>
                  <span>{reservation.basePrice} MAD</span>
                </div>
              </div>
              {reservation.tour.reservationForm && reservation.data && (
                <div className="space-y-1">
                 
                  {reservation.tour.reservationForm[0].fields.map(
                    (field: any) => {
                      const value = reservation.data[field.name];

                      // Checkbox avec supplément
                      if (
                        field.type === "checkbox" &&
                        value === true &&
                        field.price
                      ) {
                        return (
                          <div
                            key={field.name}
                            className="flex justify-between text-gray-600"
                          >
                            <span>{field.label}</span>
                            <span>+{field.price} MAD</span>
                          </div>
                        );
                      }

                      // Select avec prix sur l'option choisie
                      if (field.type === "select" && value) {
                        const selectedOption = field.options?.find(
                          (opt: any) => opt.value === value
                        );
                        if (selectedOption && selectedOption.price) {
                          return (
                            <div
                              key={field.name}
                              className="flex justify-between text-gray-600"
                            >
                              <span>
                                {field.label} ({selectedOption.label})
                              </span>
                              <span>+{selectedOption.price} MAD</span>
                            </div>
                          );
                        }
                      }

                      return null;
                    }
                  )}
                </div>
              )}
             
              <hr className="my-4" />
              <div className="flex justify-between font-bold text-base text-gray-800">
                <span>Total</span>
                <span>{reservation.finalPrice} MAD</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
