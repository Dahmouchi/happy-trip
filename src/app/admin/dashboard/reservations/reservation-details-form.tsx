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
  AlertCircle
} from "lucide-react";
import { Hotel, Tour, TourDate } from "@prisma/client";
import { StatusBadge } from "@/components/ui/status-badge";

// Simplified types for the component (removing AWS SDK dependencies)
type ReservationDetailsProps = {
  reservation: {
    
    id: string;
    fullName: string;
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
    tour:Tour;
  };
};



const DetailRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-gray-500" />
      <span className="font-medium text-gray-600">{label}</span>
    </div>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);

export const ReservationDetails: React.FC<ReservationDetailsProps> = ({ reservation }) => {
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("fr-FR", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full max-w-6xl mx-auto border-none shadow-none bg-gradient-to-br from-white to-gray-50 px-2 sm:px-4 lg:px-8">
      <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <MapPin className="w-6 h-6 text-blue-600" />
        Détails de la réservation
        </CardTitle>
      </div>
      <div className="flex items-center justify-between mt-2">
        <StatusBadge status={reservation.status}/>
      </div>
      <div className="mt-2">
        <p className="text-sm text-gray-500 mt-2">
        Réservé le {formatDate(reservation.createdAt)}
        </p>
        <p className="text-sm text-gray-500">
        ID de la réservation: <span className="font-semibold">{reservation.id}</span>
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
        <DetailRow icon={User} label="Nom complet" value={reservation.fullName} />
        <DetailRow icon={Mail} label="Email" value={reservation.email} />
        <DetailRow icon={Phone} label="Téléphone" value={reservation.phone} />
        </div>
      </div>

      <Separator />

      {/* Tour Information Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-green-600" />
        Détails du voyage
        </h3>
        <div className="bg-white rounded-lg p-4 space-y-1 border border-gray-100">
         <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2">
          <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-600">Titre de tour</span>
          <div className="flex flex-col text-sm text-gray-500">
            <span>{reservation.tourTitle}</span>
          </div>
          </div>
          </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2">
          <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-600">Période de voyage</span>
          <div className="flex flex-col text-sm text-gray-500">
            <span>
            de {formatDate(reservation.travelDate?.startDate)}
            </span>
            <span>
            à {formatDate(reservation.travelDate?.endDate)}
            </span>
          </div>
          </div>
          </div>
        </div>
        </div>

      <Separator />

      {/* Booking Details Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Users className="w-5 h-5 text-purple-600" />
        Détails de la réservation
        </h3>
        <div className="bg-white rounded-lg p-4 space-y-1 border border-gray-100 grid grid-cols-1 md:grid-cols-1 gap-2">
        <DetailRow icon={Users} label="Adulte(s)" value={reservation.adultCount} />
        <DetailRow icon={Users} label="Enfant(s)" value={reservation.childCount} />
        <DetailRow icon={Baby} label="Bébé(s)" value={reservation.infantCount} />
        <DetailRow icon={Bed} label="Chambre Single" value={reservation.singleRoom ? "Oui" : "Non"} />
        </div>
      </div>

      <Separator />

        {/* Special Requests Section */}
      {reservation.specialRequests && (
        <>
        <Separator />
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          Demandes spéciales
          </h3>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
          <p className="text-gray-700 leading-relaxed">{reservation.specialRequests}</p>
          </div>
        </div>
        </>
      )}

      {/* Hotel & Pricing Section */}

        <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-orange-600" />
        Hébergement & Prix
        </h3>
        <div className="bg-white rounded-lg p-4 space-y-1 border border-gray-100">
        <DetailRow 
          icon={Building2} 
          label="Hôtel" 
          value={reservation.hotel?.name ?? "Aucun"} 
          />
          {reservation.tour.type === "INTERNATIONAL" && (
        reservation.hotel?.price && (
          <DetailRow icon={DollarSign} label="Prix hôtel" value={`${reservation.hotel.price} MAD`} />
        )
        )}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 border-t border-gray-100 mt-3 pt-3">
          <div className="flex items-center gap-3">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="font-semibold text-gray-800">Prix total</span>
          </div>
          <span className="text-xl font-bold text-green-600 mt-2 sm:mt-0">{reservation.totalPrice} MAD</span>
        </div>
        </div>
      </div>

      
      </CardContent>
    </Card>
  );
};
