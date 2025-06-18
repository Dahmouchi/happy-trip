/* eslint-disable @typescript-eslint/no-unused-vars */
// reservationActions.ts
'use server';
import prisma from "@/lib/prisma";
import { ReservationStatus } from "@prisma/client";
import { Turtle } from "lucide-react";


interface Reservation {
  tourId: string;
  hotelId?: string | null;
  travelDateId: string;
  fullName: string;
  email: string;
  phone: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
  singleRoom?: boolean;
  specialRequests?: string;
  totalPrice: number;
  termsAccepted: boolean;
}


export async function CreateReservation(data: Reservation) {
  try {
    let hotelPrice = 0;
    if (data.hotelId) {
      const hotel = await prisma.hotel.findUnique({
        where: { id: data.hotelId },
        select: { price: true },
      });
      hotelPrice = hotel?.price || 0;
    }

    let tourPrice = 0;
    if (data.tourId) {
      const tour = await prisma.tour.findUnique({
        where: { id: data.tourId },
        select: { priceDiscounted: true },
      });
      tourPrice = tour?.priceDiscounted || 0;
    }

    const reservation = await prisma.reservation.create({
      data: {
        tourId: data.tourId,
        hotelId: data.hotelId ? data.hotelId : null,
        travelDateId: data.travelDateId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        adultCount: data.adultCount,
        childCount: data.childCount,
        infantCount: data.infantCount,
        singleRoom: data.singleRoom ?? false,
        specialRequests: data.specialRequests,
        totalPrice: data.totalPrice + (data.singleRoom ? 100 : 0) + hotelPrice + tourPrice,
        termsAccepted: data.termsAccepted,
        status: ReservationStatus.PENDING,
      },
      
    });

    return reservation;
  } catch (error) {
    throw new Error("Failed to create reservation");
  }
}


export async function GetAllReservations() {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        tour: true,
        hotel: true,
        travelDate: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reservations;
  } catch (error) {
    throw new Error("Failed to fetch reservations");
  }
}

export async function UpdateReservationStatus(id: string, status: ReservationStatus) {
  try {
    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: { status },
    });

    return { success: true, reservation: updatedReservation };
  } catch (error) {
    return { success: false, error: "Failed to update reservation status" };
  }
}

export async function UpdateReservation(id: string, data: Partial<Reservation>) {
  try {
    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: {
        hotelId: data.hotelId ? data.hotelId : null,
        travelDateId: data.travelDateId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        adultCount: data.adultCount,
        childCount: data.childCount,
        infantCount: data.infantCount,
        singleRoom: data.singleRoom ?? false,
        specialRequests: data.specialRequests,
        totalPrice: data.totalPrice,
        termsAccepted: data.termsAccepted,
      },
    });

    return { success: true, reservation: updatedReservation };
  } catch (error) {
    return { success: false, error: "Failed to update reservation" };
  }
}

export async function DeleteReservation(id: string) {
  try {
    await prisma.reservation.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete reservation" };
  }
}