/*
  Warnings:

  - You are about to drop the column `travelDate` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `travelDateId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_hotelId_fkey";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "travelDate",
ADD COLUMN     "travelDateId" TEXT NOT NULL,
ALTER COLUMN "hotelId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_travelDateId_fkey" FOREIGN KEY ("travelDateId") REFERENCES "TourDate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
