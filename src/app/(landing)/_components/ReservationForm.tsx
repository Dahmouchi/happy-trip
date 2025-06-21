/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// --- Shadcn UI Imports (User needs to install these) ---
// Run: npx shadcn@latest add form input select textarea checkbox button label
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label"; // Import Label
import { getHotels } from "@/actions/hotelsActions";
import { createReadStream } from "fs";
import { CreateReservation } from "@/actions/reservationsActions";
import { toast } from "react-toastify";



  const reservationStatusEnum = z.enum(["PENDING", "CONFIRMED", "CANCELLED"]);

const reservationSchema = z.object({
  tourId: z.string().min(1, "Tour is required"),
  hotelId: z.string().optional(),
  travelDateId: z.string(),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  adultCount: z.number().min(1, "At least 1 adult required"),
  childCount: z.number().min(0),
  infantCount: z.number().min(0),
  singleRoom: z.boolean().optional(),
  specialRequests: z.string().optional().nullable(),
  termsAccepted: z.boolean().refine(val => val === true, { message: "You must accept the terms and conditions" }),
  status: reservationStatusEnum.default("PENDING"),
  totalPrice: z.number().min(0),
});


// --- Main Reservation Section Component ---
const ReservationSection = ({
  availableDates,
  hotels,
  tour, 
  imageSrc = "/placeholder-image.jpg",
}: any) => {

  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = React.useState(false);

  // 1. Define your form.
const form = useForm({
  resolver: zodResolver(reservationSchema),
  mode: "onChange",
  defaultValues: {
    tourId: tour.id,           // string
    hotelId: "",          // string optional, but better to start empty string
    travelDateId: "",     // string (id of selected date)
    fullName: "",
    email: "",
    phone: "",
    adultCount: 1,
    childCount: 0,
    infantCount: 0,
    singleRoom: false,
    specialRequests: null,  // or ""
    termsAccepted: false,
    status: "PENDING",
    totalPrice: 0,
  }
});



  async function onSubmit(values: any) {
    console.log("Form submitted with values:", values); 
    try {
      await CreateReservation(values);
      setIsSubmittedSuccessfully(true);
    }
    catch (error) {
      toast.error("Une erreur s'est produite lors de la création de la réservation.");
      return;
    }
    toast.success("Réservation créée avec succès !");
  }

  const numberOptions = (max: any) => {
    return Array.from({ length: max + 1 }, (_, i) => (
      <SelectItem key={i} value={String(i)}>
        {i}
      </SelectItem>
    ));
  };

  return (

  


    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 md:gap-12 items-start">
        {/* Left Column: Form */}

      {isSubmittedSuccessfully ? (
        <div className="flex flex-col items-center justify-center bg-lime-50 border border-lime-300 text-lime-800 p-8 rounded-xl shadow-lg transition-all duration-300">
          <svg
            className="w-16 h-16 mb-4 text-lime-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12l3 3 5-5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          <h3 className="text-2xl font-bold mb-2">Réservation réussie !</h3>
            <p className="text-lg font-medium text-center">
            L’équipe <span className="font-bold text-lime-600">HAPPYTRIP</span> vous contactera prochainement.<br />
            Merci pour votre confiance!
            </p>
        </div>
      ) : (
        
        // {/* Image Section */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border border-gray-100">
          {/* Form Header */}
          <div
            className="mb-6 pb-4 border-b border-gray-200"
            style={{
              backgroundColor: "#8ebd21",
              color: "white",
              padding: "1rem",
              borderRadius: "8px 8px 0 0",
              marginTop: "-1.5rem",
              marginLeft: "-2rem",
              marginRight: "-2rem",
            }}
            >
            <h2 className="text-2xl font-bold text-center">RÉSERVATION</h2>
            <div className="flex justify-center mt-1">
              <span className="w-3 h-1 bg-yellow-400 rounded-full mr-1"></span>
              <span className="w-8 h-1 bg-yellow-500 rounded-full"></span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Nom & Téléphone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nom Complet <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nom Complet"
                          {...field}
                          className="rounded-md border-gray-300"
                          />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Téléphone <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Téléphone"
                          {...field}
                          className="rounded-md border-gray-300"
                          />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
              </div>

              {/* E-mail */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        E-mail <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="E-mail"
                          {...field}
                          className="rounded-md border-gray-300"
                          />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />

                {/* Participants */}
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="adultCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Adulte <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                          >
                          <FormControl>
                            <SelectTrigger className="rounded-md border-gray-300">
                              <SelectValue placeholder="1" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>{numberOptions(10)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                    />
                  <FormField
                    control={form.control}
                    name="childCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          6-11 ans <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={field.value !== undefined && field.value !== null ? String(field.value) : "0"}
                          >
                          <FormControl>
                            <SelectTrigger className="rounded-md border-gray-300">
                              <SelectValue placeholder="0" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>{numberOptions(5)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                    />
                  <FormField
                    control={form.control}
                    name="infantCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          2-5 ans <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={field.value !== undefined && field.value !== null ? String(field.value) : "0"}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-md border-gray-300">
                              <SelectValue placeholder="0" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>{numberOptions(5)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                    />
                </div>
              </div>

                {/* Hotel & Chambre */}
                  {tour.type === "INTERNATIONAL" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hotelId"
                  render={({ field }) => (
                  <FormItem>
                  <FormLabel>
                  Hôtel <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  >
                  <FormControl>
                    <SelectTrigger className="rounded-md border-gray-300">
                    <SelectValue placeholder="Sélectionnez un hôtel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {hotels.map((hotel: any) => (
                    <SelectItem key={hotel.id} value={hotel.id}>
                    {hotel.name}
                    </SelectItem>
                    ))}
                  </SelectContent>
                  </Select>
                  {/* Show hotel price if selected */}
                  {field.value && (
                    <div className="mt-2 text-sm text-gray-700">
                    Prix:{" "}
                    <span className="font-semibold">
                      {hotels.find((h: any) => h.id === field.value)?.price
                      ? `${hotels.find((h: any) => h.id === field.value)?.price} MAD`
                      : "N/A"}
                    </span>
                    </div>
                  )}
                  <FormMessage />
                  </FormItem>
                  )}
                />

                  <FormField
                  control={form.control}
                  name="singleRoom"
                  render={({ field }) => (
                  <FormItem>
                  <FormLabel>
                    Chambre Single <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "Oui")}
                    value={field.value ? "Oui" : "Non"}
                  >
                    <FormControl>
                    <SelectTrigger className="rounded-md border-gray-300">
                    <SelectValue placeholder="Non" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="Non">Non</SelectItem>
                    <SelectItem value="Oui">Oui</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  </FormItem>
                  )}
                  />
                </div>
                )}

              {/* Date de Voyage */}
              <FormField
                control={form.control}
                name="travelDateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Date de Voyage <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-md border-gray-300">
                          <SelectValue placeholder="Sélectionnez une date" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableDates
                          .filter((date: any) => date.visible)
                          .map((date: any) => (
                            <SelectItem key={date.id} value={date.id}>
                              {date.name}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />





              {/* Autres remarques */}
              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Autres remarques</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="..."
                        {...field}
                        value={field.value ?? ""}
                        className="rounded-md border-gray-300"
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />

              {/* Conditions générales */}
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md py-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <Label htmlFor="termsAccepted" className="text-sm">
                        J&apos;ai lu et accepté les{" "}
                        <a
                          href="/conditions-generales"
                          target="_blank"
                          className="text-red-500 hover:underline font-medium"
                          >
                          conditions générales
                        </a>
                        .
                      </Label>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
                />

              {/*  Submit Button */}
             <Button
                type="submit"
                disabled={!form.formState.isValid}
                onClick={() => {
                  console.log("Submitting form with values:", form.getValues());
                }}
                className="w-full text-lg font-semibold rounded-md"
                style={{ backgroundColor: "#8ebd21", color: "white" }}
              >
                JE VALIDE
              </Button>
            </form>
          </Form>
        </div>
      )}

      
      </div>
    </div>

              );
}


// --- Example Data for Selects (Replace with your actual data) ---

// --- Example Usage Component ---
// In your Next.js page:
// import ReservationSection from '@/components/ReservationSection';
// import { sampleAvailableDates, sampleHotels } from '@/components/ReservationSection'; // Or load your data
//
// export default function BookingPage() {
//   // IMPORTANT: Make sure you have installed Shadcn UI components:
//   // npx shadcn@latest add form input select textarea checkbox button label
//
//   return (
//     <div className="container mx-auto py-12">
//       <ReservationSection
//         availableDates={sampleAvailableDates}
//         hotels={sampleHotels}
//         imageSrc="/path/to/your/image.jpg" // Provide image path
//       />
//     </div>
//   );
// }

export default ReservationSection;


