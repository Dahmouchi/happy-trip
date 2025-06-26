-- DropForeignKey
ALTER TABLE "ReservationForm" DROP CONSTRAINT "ReservationForm_tourId_fkey";

-- DropForeignKey
ALTER TABLE "Reservations" DROP CONSTRAINT "Reservations_tourId_fkey";

-- AddForeignKey
ALTER TABLE "ReservationForm" ADD CONSTRAINT "ReservationForm_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservations" ADD CONSTRAINT "Reservations_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
