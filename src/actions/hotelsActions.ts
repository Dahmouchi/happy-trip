'use server';

import prisma from '@/lib/prisma';


export async function createHotel(formData: FormData) {
    try {
        const hotel = await prisma.hotel.create({
        data: {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            price: parseFloat(formData.get("price") as string) || 0,
        },
        })
        return hotel
    } catch (error) {
        console.error("Error creating hotel:", error)
        throw error
    }
}

export async function getHotels() {
    try {
        const hotels = await prisma.hotel.findMany({
            orderBy: { name: 'asc' },
        });
        return hotels;
    } catch (error) {
        console.error("Error fetching hotels:", error);
        return [];
    }
}


export async function updateHotel(id: string, formData: FormData) {
    try {
        const hotel = await prisma.hotel.update({
            where: { id },
            data: {
                name: formData.get("name") as string,
                description: formData.get("description") as string,
                price: parseFloat(formData.get("price") as string) || 0,
            },
        });
        return hotel;
    } catch (error) {
        console.error("Error updating hotel:", error);
        throw error;
    }
}


export async function deleteHotel(id: string) {
    try {
        await prisma.hotel.delete({
            where: { id },
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting hotel:", error);
        throw error;
    }
}