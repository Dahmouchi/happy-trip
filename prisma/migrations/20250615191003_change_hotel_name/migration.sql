/*
  Warnings:

  - You are about to drop the `hotel` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `hotelId` to the `reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_HotelTours" DROP CONSTRAINT "_HotelTours_A_fkey";

-- DropForeignKey
ALTER TABLE "_HotelTours" DROP CONSTRAINT "_HotelTours_B_fkey";

-- AlterTable
ALTER TABLE "reservation" ADD COLUMN     "hotelId" TEXT NOT NULL;

-- DropTable
DROP TABLE "hotel";

-- CreateTable
CREATE TABLE "Hotel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HotelTours" ADD CONSTRAINT "_HotelTours_A_fkey" FOREIGN KEY ("A") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HotelTours" ADD CONSTRAINT "_HotelTours_B_fkey" FOREIGN KEY ("B") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
