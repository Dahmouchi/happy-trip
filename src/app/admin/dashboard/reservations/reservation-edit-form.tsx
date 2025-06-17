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
import { Hotel, TourDate } from "@prisma/client";


// Type definition for the reservation form data
type ReservationFormData = {
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
    travelDate: TourDate;
    hotel?: Hotel;
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
  onSave}) => {
  const [formData, setFormData] = useState<ReservationFormData>(reservation);

  const handleInputChange = (field: keyof ReservationFormData['reservation'], value: any) => {
    setFormData(prev => ({
      ...prev,
      reservation: {
        ...prev.reservation,
        [field]: value
      }
    }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof ReservationFormData] as any,
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const formatDateForInput = (date: Date | string | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-none border-none bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          Modifier la réservation
        </CardTitle>
        <div className="flex justify-between items-center mt-4">
          <span className="flex text-base font-medium text-lime-700 bg-lime-50 px-3 py-1  shadow-sm">
            {formData.reservation.tourTitle}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
        {/* status section 
            <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Save className="w-5 h-5 text-green-600" />
              Statut de la réservation
            </h3>
            <div className="bg-white rounded-lg p-4 space-y-4 border border-gray-100">
            <FormField icon={Save} label="Statut">
                <select
                    className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={formData.reservation.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmée</option>
                    <option value="cancelled">Annulée</option>
                </select>
            </FormField>
            
            </div>
            </div>

          <Separator /> */}
          <div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Informations personnelles
            </h3>
            <div className="bg-white rounded-lg p-4 space-y-4 border border-gray-100">
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
            <div className="bg-white rounded-lg p-4 space-y-4 border border-gray-100">
              {/* <FormField icon={MapPin} label="Circuit">
                <Input
                  value={formData.reservation.tourTitle}
                  onChange={(e) => handleInputChange('tourTitle', e.target.value)}
                  placeholder="Nom du circuit"
                />
              </FormField> */}
              
              <div className="grid grid-cols-2 gap-4">
                <FormField icon={Calendar} label="Date de début">
                  <Input
                    type="date"
                    value={formatDateForInput(formData.reservation.travelDate.startDate)}
                    onChange={(e) => handleNestedChange('travelDate', 'startDate', e.target.value)}
                  />
                </FormField>
                
                <FormField icon={Calendar} label="Date de fin">
                  <Input
                    type="date"
                    value={formatDateForInput(formData.reservation.travelDate.endDate)}
                    onChange={(e) => handleNestedChange('travelDate', 'endDate', e.target.value)}
                  />
                </FormField>
              </div>
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
              <div className="grid grid-cols-3 gap-4">
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

          {/* Hotel & Pricing Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-orange-600" />
              Hébergement & Prix
            </h3>
            <div className="bg-white rounded-lg p-4 space-y-4 border border-gray-100">
              <FormField icon={Building2} label="Nom de l'hôtel">
                <Input
                  value={formData.reservation.hotel?.name || ''}
                  onChange={(e) => handleNestedChange('hotel', 'name', e.target.value)}
                  placeholder="Nom de l'hôtel"
                />
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField icon={DollarSign} label="Prix hôtel (MAD)">
                  <Input
                    type="number"
                    min="0"
                    value={formData.reservation.hotel?.price || ''}
                    onChange={(e) => handleNestedChange('hotel', 'price', parseFloat(e.target.value) || 0)}
                    placeholder="Prix hôtel"
                  />
                </FormField>
               
              </div>
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
            {/* total price section  */}
            <div className="flex items-center justify-between">
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


            
            {/* Status Section */}
        </form>
      </CardContent>
    </Card>
  );
};
