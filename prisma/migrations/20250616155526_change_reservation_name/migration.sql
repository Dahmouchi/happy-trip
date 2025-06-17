/*
  Warnings:

  - You are about to drop the `reservation` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED');

-- DropForeignKey
ALTER TABLE "reservation" DROP CONSTRAINT "reservation_hotelId_fkey";

-- DropForeignKey
ALTER TABLE "reservation" DROP CONSTRAINT "reservation_tourId_fkey";

-- DropTable
DROP TABLE "reservation";

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "adultCount" INTEGER NOT NULL,
    "childCount" INTEGER NOT NULL,
    "infantCount" INTEGER NOT NULL,
    "singleRoom" BOOLEAN NOT NULL DEFAULT false,
    "specialRequests" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
