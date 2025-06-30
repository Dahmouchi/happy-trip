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
import { Badge } from "@/components/ui/badge";


const DetailRow = ({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  icon: any;
  label: string;
  value: string | number | React.ReactNode;
  className?: string;
}) => (
  <div className={`flex items-center justify-between py-2 ${className}`}>
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-gray-500" />
      <span className="font-medium text-gray-600">{label}</span>
    </div>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);

const PriceBreakdownItem = ({
  label,
  price,
  multiplier,
  isMultiplied = false,
}: {
  label: string;
  price: number;
  multiplier?: number;
  isMultiplied?: boolean;
}) => (
  <div className="flex justify-between items-center py-1 text-sm">
    <span className="text-gray-600">{label}</span>
    <div className="flex items-center gap-1">
      {isMultiplied && multiplier && multiplier > 1 ? (
        <>
          <span className="text-gray-500">+{price} × {multiplier}</span>
          <span className="text-gray-700 font-medium">= {price * multiplier} MAD</span>
        </>
      ) : (
        <span className="text-gray-700 font-medium">+{price} MAD</span>
      )}
    </div>
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

  const numberOfAdults = reservation.data?.numberOfAdults || 1;

  return (
    <Card className="w-full mx-auto border-none shadow-none bg-white rounded-xl overflow-hidden">
      <CardHeader className="bg-gray-50 px-6 py-5 border-b">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              Détails de la réservation
            </CardTitle>
            <StatusBadge status={reservation.status} />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Réservé le {formatDate(reservation.createdAt)}</span>
            </div>
            <Badge variant="outline" className="text-gray-600 font-mono">
              ID: {reservation.id}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Informations personnelles
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
            <DetailRow
              icon={User}
              label="Nom complet"
              value={`${reservation.nom} ${reservation.prenom}`}
            />
            <DetailRow icon={Mail} label="Email" value={reservation.email} />
            <DetailRow icon={Phone} label="Téléphone" value={reservation.phone} />
          </div>
        </div>

        <Separator className="my-4" />

        {/* Tour Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Détails du voyage
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
            <DetailRow
              icon={Building2}
              label="Tour"
              value={reservation.tour.title}
            />
            <DetailRow
              icon={Calendar}
              label="Période"
              value={
                <span className="flex flex-col sm:flex-row sm:gap-1">
                  <span>Du {formatDate(reservation.travelDate?.startDate)}</span>
                  <span>au {formatDate(reservation.travelDate?.endDate)}</span>
                </span>
              }
            />
            <DetailRow
              icon={Users}
              label="Participants"
              value={
                <div className="flex gap-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {numberOfAdults} adultes
                  </span>
                  {reservation.data?.childCount > 0 && (
                    <span className="flex items-center gap-1">
                      <Baby className="w-4 h-4" /> {reservation.data.childCount} enfants
                    </span>
                  )}
                </div>
              }
            />
          </div>
        </div>

        <Separator className="my-4" />

        {/* Additional Information Section */}
        {reservation.data && Object.keys(reservation.data).length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              Informations supplémentaires
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
              {Object.entries(reservation.data).map(([key, value]) => {
                if (key === 'numberOfAdults' || key === 'childCount') return null;
                return (
                  <DetailRow
                    key={key}
                    icon={Info}
                    label={key}
                    value={String(value)}
                    className="capitalize"
                  />
                );
              })}
            </div>
          </div>
        )}

        <Separator className="my-4" />

        {/* Pricing Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Détails du prix
          </h3>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="font-medium text-gray-700">Prix de base</span>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">{reservation.basePrice} × {numberOfAdults}</span>
                  <span className="font-medium">= {reservation.basePrice * numberOfAdults} MAD</span>
                </div>
              </div>

              {reservation.tour.reservationForm?.[0]?.fields?.map((field: any) => {
                const value = reservation.data?.[field.name];
                
                // Checkbox fields (multiplied by number of adults)
                if (field.type === "checkbox" && value === true && field.price) {
                  return (
                    <PriceBreakdownItem
                      key={field.name}
                      label={field.label}
                      price={field.price}
                      multiplier={numberOfAdults}
                      isMultiplied={true}
                    />
                  );
                }

                // Select fields (not multiplied)
                if (field.type === "select" && value) {
                  const selectedOption = field.options?.find(
                    (opt: any) => opt.value === value
                  );
                  if (selectedOption?.price) {
                    return (
                      <PriceBreakdownItem
                        key={field.name}
                        label={`${field.label} (${selectedOption.label})`}
                        price={selectedOption.price}
                      />
                    );
                  }
                }

                return null;
              })}

              <div className="pt-3 mt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="text-xl font-bold text-green-600">
                    {reservation.finalPrice} MAD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};