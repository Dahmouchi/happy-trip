/*
  Warnings:

  - You are about to drop the column `accomodationType` on the `Tour` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tour" DROP COLUMN "accomodationType",
ADD COLUMN     "accommodationType" TEXT;
