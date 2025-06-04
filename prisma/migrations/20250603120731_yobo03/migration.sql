/*
  Warnings:

  - You are about to drop the column `pricePerPerson` on the `Tour` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tour" DROP COLUMN "pricePerPerson",
ADD COLUMN     "priceAdvance" DOUBLE PRECISION;
