// reservationActions.ts
'use server';
import prisma from "@/lib/prisma";
import { ReservationStatus } from "@prisma/client";

interface CreateReservationInput {
  tourId: string;
  hotelId: string;
  fullName: string;
  email: string;
  phone: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
  singleRoom?: boolean;
  specialRequests?: string;
  travelDate: Date;
  totalPrice: number;
  termsAccepted: boolean;
}

export async function createReservation(data: CreateReservationInput) {
  try {
    const reservation = await prisma.reservation.create({
      data: {
        tourId: data.tourId,
        hotelId: data.hotelId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        adultCount: data.adultCount,
        childCount: data.childCount,
        infantCount: data.infantCount,
        singleRoom: data.singleRoom ?? false,
        specialRequests: data.specialRequests,
        travelDate: data.travelDate,
        totalPrice: data.totalPrice,
        termsAccepted: data.termsAccepted,
        status: ReservationStatus.PENDING,
      },
    });

    return reservation;
  } catch (error) {
    throw new Error("Failed to create reservation");
  }
}
