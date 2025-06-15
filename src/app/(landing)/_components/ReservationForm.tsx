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

// --- Form Schema Definition (using Zod) ---
const formSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Le nom complet doit contenir au moins 2 caractères." }),
  email: z
    .string()
    .email({ message: "Veuillez entrer une adresse e-mail valide." }),
  phone: z
    .string()
    .min(10, { message: "Le numéro de téléphone doit être valide." }),
  adultCount: z
    .string()
    .min(1, { message: "Sélectionnez le nombre d'adultes." }),
  childCount: z.string(),
  infantCount: z.string(),
  singleRoom: z
    .string()
    .refine((val) => val === "Oui" || val === "Non", {
      message: "Veuillez indiquer si vous souhaitez une chambre single.",
    }),
  specialRequests: z.string().optional(),
  // totalPrice, status, createdAt, updatedAt are handled server-side
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions générales.",
  }),
  hotel: z.string().refine((val) => val !== "", {
    message: "Veuillez sélectionner un hôtel.",
  }),
  travelDate: z.string().refine((val) => val !== "", {
    message: "Veuillez sélectionner une date de voyage.",
  }),
});

// --- Main Reservation Section Component ---
const ReservationSection = ({
  availableDates,
  hotels,
  imageSrc = "/placeholder-image.jpg",
}: any) => {
  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      adultCount: "1", // Default to 1 adult
      childCount: "0", // Default to 0 children aged 6-11
      infantCount: "0", // Default to 0 children aged 2-5
      hotel: "", // Default to first hotel
      singleRoom: "Non", // Default to no single room
      travelDate: "", // Default to no date selected
      specialRequests: "",
      termsAccepted: false, // Default to not accepted
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: any) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    alert("Formulaire soumis ! Vérifiez la console pour les valeurs."); // Placeholder action
  }

  // --- Helper for number options ---
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
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border border-gray-100">
          {/* Form Header */}
          <div
            className="mb-6 pb-4 border-b border-gray-200"
            style={{
              backgroundColor: "#83CD20",
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
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hotel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Hotel <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-md border-gray-300">
                            <SelectValue placeholder="Sélectionnez un hôtel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {hotels.map((hotel: any) => (
                            <SelectItem key={hotel.value} value={hotel.value}>
                              {hotel.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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

              {/* Date de Voyage */}
              <FormField
                control={form.control}
                name="travelDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Date de Voyage <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-md border-gray-300">
                          <SelectValue placeholder="Sélectionnez une date" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableDates.map((date: any) => (
                          <SelectItem key={date.value} value={date.value}>
                            {date.label}
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

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full text-lg font-semibold rounded-md"
                style={{ backgroundColor: "#83CD20", color: "white" }}
              >
                JE VALIDE
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

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
