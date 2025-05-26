/*
  Warnings:

  - You are about to drop the `VacationStyle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TourVacationStyles` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DestinaionType" AS ENUM ('NATIONAL', 'INTERNATIONAL', 'EN_MESURE');

-- DropForeignKey
ALTER TABLE "_TourVacationStyles" DROP CONSTRAINT "_TourVacationStyles_A_fkey";

-- DropForeignKey
ALTER TABLE "_TourVacationStyles" DROP CONSTRAINT "_TourVacationStyles_B_fkey";

-- DropTable
DROP TABLE "VacationStyle";

-- DropTable
DROP TABLE "_TourVacationStyles";

-- CreateTable
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DestinaionType" NOT NULL DEFAULT 'NATIONAL',
    "imageUrl" TEXT,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "Nature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DestinationToTour" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DestinationToTour_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CategoryTours" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryTours_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_NatureTours" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NatureTours_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Destination_name_key" ON "Destination"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Nature_name_key" ON "Nature"("name");

-- CreateIndex
CREATE INDEX "_DestinationToTour_B_index" ON "_DestinationToTour"("B");

-- CreateIndex
CREATE INDEX "_CategoryTours_B_index" ON "_CategoryTours"("B");

-- CreateIndex
CREATE INDEX "_NatureTours_B_index" ON "_NatureTours"("B");

-- AddForeignKey
ALTER TABLE "_DestinationToTour" ADD CONSTRAINT "_DestinationToTour_A_fkey" FOREIGN KEY ("A") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DestinationToTour" ADD CONSTRAINT "_DestinationToTour_B_fkey" FOREIGN KEY ("B") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryTours" ADD CONSTRAINT "_CategoryTours_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryTours" ADD CONSTRAINT "_CategoryTours_B_fkey" FOREIGN KEY ("B") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NatureTours" ADD CONSTRAINT "_NatureTours_A_fkey" FOREIGN KEY ("A") REFERENCES "Nature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NatureTours" ADD CONSTRAINT "_NatureTours_B_fkey" FOREIGN KEY ("B") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
