/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// reservationActions.ts
'use server';
import prisma from "@/lib/prisma";
import { ReservationStatus } from "@prisma/client";


interface Reservation {
  tourId: string;
  hotelId: string;
  travelDateId: string;
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

export async function CreateReservation(data: Reservation) {
  try {
    const reservation = await prisma.reservation.create({
      data: {
        tourId: data.tourId,
        hotelId: data.hotelId? data.hotelId : null,
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
    const updateData: any = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updateData[key] = value;
      }
    });

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: updateData,
    });

    return updatedReservation;
  } catch (error) {
    throw new Error("Failed to update reservation");
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