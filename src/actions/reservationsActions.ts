'use server';

import prisma from "@/lib/prisma";
import z from "zod";

const formSchema = z.object({
  tourId: z.string().min(1, { message: "Tour requis." }),
  hotelId: z.string().min(1, { message: "Hôtel requis." }),
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
    .number({ invalid_type_error: "Nombre d'adultes requis." })
    .min(1, { message: "Sélectionnez au moins 1 adulte." }),
  childCount: z
    .number({ invalid_type_error: "Nombre d'enfants requis." })
    .min(0),
  infantCount: z
    .number({ invalid_type_error: "Nombre d'enfants requis." })
    .min(0),
  singleRoom: z.boolean(),
  specialRequests: z.string().optional(),
  date: z.string().min(1, { message: "Veuillez sélectionner une date de voyage." }),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions générales.",
  }),
  hotel: z.string().min(1, { message: "Hôtel requis." }),
  travelDate: z.string().min(1, { message: "Veuillez sélectionner une date de voyage." }),
});


export async function createReservation(formShema:any)
{
    try {
        const parsedData = formSchema.parse(formShema);
        
        const reservation = await prisma.reservation.create({
            data: {
                tourId: parsedData.tourId,
                hotelId: parsedData.hotelId,
                fullName: parsedData.fullName,
                email: parsedData.email,
                phone: parsedData.phone,
                adultCount: parsedData.adultCount,
                childCount: parsedData.childCount,
                infantCount: parsedData.infantCount,
                singleRoom: parsedData.singleRoom,
                specialRequests: parsedData.specialRequests || null,
                date: new Date(parsedData.date),
                totalPrice: 0, // Remplacez 0 par le calcul réel du prix si nécessaire
            },
        });

        return reservation;
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
        }
        throw new Error("can't create reservation");
    }
    
}