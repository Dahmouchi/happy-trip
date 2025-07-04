/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Hotel, Reservation, TourDate, TravelType } from '@prisma/client';
import { toast } from 'react-toastify';
import { reservationColumns } from './reservation-columns';
import { GetAllReservations } from '@/actions/reservationsActions';
import { DataTable } from './reservations-data-table';
import { hasUncaughtExceptionCaptureCallback } from 'process';

type ReservationData = Reservation & {
    tourTitle: string;
    hotel:Hotel;
    travelDate:TourDate;
    createdAt: Date;
};

export default function ReservationsPage() {
    const [reservations, setReservations] = useState<any[]>([]);

    const fetchReservations = useCallback(async () => {
        try {
            const response = await GetAllReservations();
            console.log(response);
            setReservations(response);
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
            <DataTable<any, unknown>
                columns={reservationColumns({ refresh: fetchReservations })}
            data={reservations}
            />
        </div>
    );
}