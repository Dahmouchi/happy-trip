/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Hotel, Reservation, TourDate, TravelType } from '@prisma/client';
import { toast } from 'react-toastify';
import { reservationColumns } from './reservation-columns';
import { GetAllReservations } from '@/actions/reservationsActions';
import { DataTable } from './reservations-data-table';
import { DateTime } from 'aws-sdk/clients/devicefarm';
import { Float } from 'aws-sdk/clients/batch';
import { hasUncaughtExceptionCaptureCallback } from 'process';

type ReservationData = Reservation & {
    tourTitle: string;
    hotel:Hotel;
    travelDate:TourDate;
    createdAt: DateTime;
};

export default function ReservationsPage() {
    const [reservations, setReservations] = useState<ReservationData[]>([]);

    const fetchReservations = useCallback(async () => {
        try {
            const response = await GetAllReservations();
            console.log(response);

            const enrichedReservations = response.map((reservation: any) => ({
                ...reservation,
                tourTitle: reservation.tour?.title || 'Circuit inconnu',
                hotel: reservation.hotel || null,
                TravelDate: reservation.travelDate || null,
                createdAt: reservation.createdAt,
            }));
            setReservations(enrichedReservations);
        } catch (error) {
            toast.error('Erreur lors de la récupération des réservations');
        }
    }, []);

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    return (
        <div className="mx-auto  p-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Réservations</h1>
            <p className="text-lg text-gray-600 mb-6">Ci-dessous la liste de toutes les réservations.</p>
            <DataTable<ReservationData, unknown>
                columns={reservationColumns({ refresh: fetchReservations })}
            data={reservations}
            />
        </div>
    );
}