/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  MessageSquare} from "lucide-react";
import { Hotel, Tour, TourDate } from "@prisma/client";
import { getTourById } from "@/actions/toursActions";
import { updateBlog } from "@/actions/blogs";
import { UpdateReservation } from "@/actions/reservationsActions";
import { toast } from "react-toastify";
import { spec } from "node:test/reporters";


// Type definition for the reservation form data
type ReservationFormData = {
  reservation: {
    id: string;
    tourId: string;
    hotelId?: string | null;
    travelDateId: string ;
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
    travelDate: TourDate;
    hotel?: Hotel;
    tour: Tour;
  };
};



type ReservationEditFormProps = {
  reservation: ReservationFormData;
  onSave: (updatedReservation: ReservationFormData) => void;
  onCancel: () => void;
};

const FormField = ({ 
  icon: Icon, 
  label, 
  children 
}: { 
  icon: any; 
  label: string; 
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      <Icon className="w-4 h-4 text-gray-500" />
      {label}
    </Label>
    {children}
  </div>
);


export const ReservationEditForm: React.FC<ReservationEditFormProps> = ({ 
  reservation, 
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ReservationFormData>(reservation);
  const [availableTourDates, setAvailableTourDates] = useState<TourDate[]>(() => (reservation as any).availableTourDates || []);
  const [availableHotels, setAvailableHotels] = useState<Hotel[]>(() => (reservation as any).availableHotels || []);


  React.useEffect(() => {
    async function fetchTourDates() {
      if (formData.reservation && (formData.reservation as any).tourId) {
        const tour = await getTourById((formData.reservation as any).tourId);
        if (tour && tour.data?.dates) {
          setAvailableTourDates(tour.data.dates);
        }
      }
    }
    async function fetchHotels() {
      if (formData.reservation && (formData.reservation as any).tourId) {
        const tour = await getTourById((formData.reservation as any).tourId);
        if (tour && tour.data?.hotels) {
          setAvailableHotels(tour.data.hotels);
        }
      }
    }
    fetchHotels();
    fetchTourDates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.reservation?.tourTitle]);
  const handleInputChange = (field: keyof ReservationFormData['reservation'], value: any) => {
    setFormData(prev => ({
      ...prev,
      reservation: {
        ...prev.reservation,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const reservationData = {
      ...formData.reservation,
      specialRequests: formData.reservation.specialRequests ?? undefined,
      termsAccepted: true, // Assuming terms are always accepted for edit
    };
    try {
      const result = await UpdateReservation(formData.reservation.id, reservationData);
      if (result.error) {
        toast.error("Erreur lors de la mise à jour de la réservation.");
        return;
      }
      toast.success("Réservation mise à jour avec succès !");
      onSave(formData);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la réservation. Veuillez réessayer.");
    }
  };

  const formatDateForInput = (date: Date | string | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  return (
    <Card className="w-full max-w-7xl mx-auto shadow-none border-none bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4">
      <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <MapPin className="w-6 h-6 text-blue-600" />
        Modifier la réservation
      </CardTitle>
      <div className="flex justify-between items-center mt-4">
        <span className="flex items-center gap-2 text-base font-semibold text-lime-800 bg-gradient-to-r from-lime-100 to-lime-50 px-4 py-2 rounded-lg shadow-sm border border-lime-200">
          <MapPin className="w-4 h-4 text-lime-600" />
          {formData.reservation.tourTitle}
        </span>
      </div>
      </CardHeader>

      <CardContent>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information Section */}
        <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Informations personnelles
        </h3>
        <div className="bg-white rounded-lg p-4 space-y-4 border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField icon={User} label="Nom complet">
          <Input
            value={formData.reservation.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Nom complet"
          />
          </FormField>
          
          <FormField icon={Mail} label="Email">
          <Input
            type="email"
            value={formData.reservation.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Email"
          />
          </FormField>
          
          <FormField icon={Phone} label="Téléphone">
          <Input
            value={formData.reservation.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Téléphone"
          />
          </FormField>
        </div>
        </div>

        <Separator />

        {/* Tour Information Section */}
        <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-600" />
          Détails du voyage
        </h3>
        <div className="bg-white rounded-lg p-4 space-y-4 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField icon={Calendar} label="Date de voyage">
        <select
          className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
          value={formData.reservation.travelDateId || ''}
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedDate = availableTourDates.find((date) => date.id === selectedId);
            handleInputChange('travelDateId', selectedId);
            handleInputChange('travelDate', selectedDate || null);
          }}
        >
          <option value="" disabled>
            Sélectionnez une date
          </option>
          {availableTourDates.map((date) => (
            <option key={date.id} value={date.id}>
              du {date.startDate ? new Date(date.startDate).toLocaleDateString("fr-FR") : ""} au {date.endDate ? new Date(date.endDate).toLocaleDateString("fr-FR") : ""}
            </option>
          ))}
        </select>
          </FormField>
        </div>
        </div>

        <Separator />

        {/* Booking Details Section */}
        <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          Détails de la réservation
        </h3>
        <div className="bg-white rounded-lg p-4 space-y-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField icon={Users} label="Adulte(s)">
            <Input
            type="number"
            min="0"
            value={formData.reservation.adultCount}
            onChange={(e) => handleInputChange('adultCount', parseInt(e.target.value) || 0)}
            />
          </FormField>
          
          <FormField icon={Users} label="Enfant(s)">
            <Input
            type="number"
            min="0"
            value={formData.reservation.childCount}
            onChange={(e) => handleInputChange('childCount', parseInt(e.target.value) || 0)}
            />
          </FormField>
          
          <FormField icon={Baby} label="Bébé(s)">
            <Input
            type="number"
            min="0"
            value={formData.reservation.infantCount}
            onChange={(e) => handleInputChange('infantCount', parseInt(e.target.value) || 0)}
            />
          </FormField>
          </div>

          <FormField icon={Bed} label="Chambre Single">
          <div className="flex items-center space-x-2">
            <Switch
            checked={formData.reservation.singleRoom}
            onCheckedChange={(checked) => handleInputChange('singleRoom', checked)}
            />
            <span className="text-sm text-gray-600">
            {formData.reservation.singleRoom ? "Oui" : "Non"}
            </span>
          </div>
          </FormField>
        </div>
        </div>


        <Separator />

        {/* Special Requests Section */}
        <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          Demandes spéciales
        </h3>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <Textarea
          value={formData.reservation.specialRequests || ''}
          onChange={(e) => handleInputChange('specialRequests', e.target.value)}
          placeholder="Demandes spéciales..."
          className="min-h-[100px]"
          />
        </div>
        </div>
       

        <Separator />

        {/* Hotel & Pricing Section */}
        {reservation.reservation.tour.type === "INTERNATIONAL" && (

          <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-orange-600" />
          Hébergement & Prix
        </h3>
        <div className="bg-white rounded-lg p-4 space-y-4 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField icon={Building2} label="Nom de l'hôtel">
          <select
            className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
            value={formData.reservation.hotelId || ''}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedHotel = availableHotels.find((hotel) => hotel.id === selectedId);
              handleInputChange('hotelId', selectedId);
              handleInputChange('hotel', selectedHotel || null);
            }}
          >
            {availableHotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </select>
          </FormField>
          <div>
          {formData.reservation.hotel?.description && (
            <>
            <span className="block mb-1 text-xs font-semibold text-orange-700 uppercase tracking-wide">
              Description de l&apos;hôtel
            </span>
            <div
              className="mb-2 text-sm text-gray-600 bg-gray-50 rounded p-2"
              dangerouslySetInnerHTML={{ __html: formData.reservation.hotel.description }} />
            </>
          )}
          <span className="block mb-1 text-xs font-semibold text-orange-700 uppercase tracking-wide">
            Prix par nuit
          </span>
          <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 mt-2">
            <span className="text-base font-semibold text-orange-700 flex items-center gap-1">
            {formData.reservation.hotel?.price != null ? (
              <>
              {formData.reservation.hotel.price}
              <span className="text-xs font-normal text-gray-500 ml-1">MAD / nuit</span>
              </>
            ) : (
              <span className="text-gray-400">Prix non disponible</span>
            )}
            </span>
          </div>
          </div>
        </div>
        </div>

      )}

         <Separator />
        {/* total price section  */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <FormField icon={DollarSign} label="Prix total (MAD)">
          <Input
          type="number"
          min="0"
          value={formData.reservation.totalPrice}
          onChange={(e) => handleInputChange('totalPrice', parseFloat(e.target.value) || 0)}
          placeholder="Prix total"
          />
        </FormField>
        </div>



        <Separator />
        {/* Save and Cancel Buttons */}
        <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-4 mt-6">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 bg-lime-600 text-white rounded-lg shadow hover:bg-lime-700 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Enregistrer
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 px-5 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Annuler
          </button>
        </div>


        
      </form>
      </CardContent>
    </Card>
  );
};
