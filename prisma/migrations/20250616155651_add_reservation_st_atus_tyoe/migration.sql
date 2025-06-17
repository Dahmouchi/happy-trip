/*
  Warnings:

  - The `status` column on the `Reservation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "status",
ADD COLUMN     "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING';
