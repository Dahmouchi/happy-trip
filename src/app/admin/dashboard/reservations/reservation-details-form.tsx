// // components/reservations/reservation-details.tsx

// import React from "react";
// import { Reservation, Hotel, TourDate } from "@prisma/client";
// import { Float } from "aws-sdk/clients/batch";
// import { DateTime } from "aws-sdk/clients/devicefarm";

// type Props = {
//   reservation: Reservation & {
//     reservationDate: Date;
//     tourTitle: string;
//     hotel: Hotel;
//     travelDate: TourDate;
//     hotelName: string;
//     hotelPrice: Float;
//     startDate: DateTime;
//     endDate: DateTime;
//   };
// };

// export const ReservationDetails: React.FC<Props> = ({ reservation }) => {
//   return (
//     <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto space-y-4 border border-gray-100">
//       <h2 className="text-xl font-semibold mb-4 text-gray-800">Détails de la réservation</h2>
//       <div className="grid grid-cols-1 gap-y-3">
//         <div className="flex justify-between">
//           <span className="font-medium text-gray-600">Nom complet:</span>
//           <span className="text-gray-900">{reservation.fullName}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="font-medium text-gray-600">Email:</span>
//           <span className="text-gray-900">{reservation.email}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="font-medium text-gray-600">Téléphone:</span>
//           <span className="text-gray-900">{reservation.phone}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="font-medium text-gray-600">Titre du circuit:</span>
//           <span className="text-gray-900">{reservation.tourTitle}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="font-medium text-gray-600">Date de voyage:</span>
//           <span className="text-gray-900">
//             {reservation.travelDate.startDate
//               ? new Date(reservation.travelDate.startDate).toLocaleDateString("fr-FR")
//               : "N/A"}{" "}
//             –{" "}
//             {reservation.travelDate.endDate
//               ? new Date(reservation.travelDate.endDate).toLocaleDateString("fr-FR")
//               : "N/A"}
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="font-medium text-gray-600">Adulte(s):</span>
//           <span className="text-gray-900">{reservation.adultCount}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="font-medium text-gray-600">Enfant(s):</span>
//           <span className="text-gray-900">{reservation.childCount}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="font-medium text-gray-600">Bébé(s):</span>
//           <span className="text-gray-900">{reservation.infantCount}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="font-medium text-gray-600">Chambre Single:</span>
//           <span className="text-gray-900">{reservation.singleRoom ? "Oui" : "Non"}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="font-medium text-gray-600">Prix total:</span>
//           <span className="text-gray-900">{reservation.totalPrice} MAD</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="font-medium text-gray-600">Hôtel:</span>
//           <span className="text-gray-900">
//             {reservation.hotel?.name ?? "Aucun"}
//             {reservation.hotel?.price && ` - ${reservation.hotel.price} MAD`}
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <span className="font-medium text-gray-600">Demandes spéciales:</span>
//           <span className="text-gray-900">{reservation.specialRequests || "Aucune"}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="font-medium text-gray-600">Statut:</span>
//           <span className="text-gray-900">{reservation.status}</span>
//         </div>
//       </div>
//     </div>
//   );
// };




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
import { Hotel, TourDate } from "@prisma/client";

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
  };
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'confirmé':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
      case 'annulé':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'confirmé':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
      case 'en attente':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
      case 'annulé':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(status)}`}>
      {getStatusIcon(status)}
      {status}
    </span>
  );
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
    <Card className="max-w-3xl mx-auto border-none shadow-none bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            Détails de la réservation
          </CardTitle>
          <StatusBadge status={reservation.status} />
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
           <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-600">Titre du circuit</span>
                </div>
                <span className="text-gray-900 font-medium">{reservation.tourTitle}</span>
            </div>

            <div className="flex items-center justify-between py-2">
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
          <div className="bg-white rounded-lg p-4 space-y-1 border border-gray-100">
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
            {reservation.hotel?.price && (
              <DetailRow icon={DollarSign} label="Prix hôtel" value={`${reservation.hotel.price} MAD`} />
            )}
            <div className="flex items-center justify-between py-2 border-t border-gray-100 mt-3 pt-3">
              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-gray-800">Prix total</span>
              </div>
              <span className="text-xl font-bold text-green-600">{reservation.totalPrice} MAD</span>
            </div>
          </div>
        </div>

      
      </CardContent>
    </Card>
  );
};
