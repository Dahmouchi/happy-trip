/*
  Warnings:

  - You are about to drop the `_DestinationToTour` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `imageUrl` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `Destination` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `Nature` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "_DestinationToTour" DROP CONSTRAINT "_DestinationToTour_A_fkey";

-- DropForeignKey
ALTER TABLE "_DestinationToTour" DROP CONSTRAINT "_DestinationToTour_B_fkey";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "imageUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "Destination" ALTER COLUMN "imageUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "Nature" ALTER COLUMN "imageUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "accomodationType" TEXT;

-- DropTable
DROP TABLE "_DestinationToTour";

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "tourId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TourDestinations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TourDestinations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TourDestinations_B_index" ON "_TourDestinations"("B");

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TourDestinations" ADD CONSTRAINT "_TourDestinations_A_fkey" FOREIGN KEY ("A") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TourDestinations" ADD CONSTRAINT "_TourDestinations_B_fkey" FOREIGN KEY ("B") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
