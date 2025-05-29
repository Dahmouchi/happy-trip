/*
  Warnings:

  - You are about to drop the column `accommodation` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `activite` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `destination` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `exclu` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `inclu` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Tour` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tour" DROP COLUMN "accommodation",
DROP COLUMN "activite",
DROP COLUMN "destination",
DROP COLUMN "endDate",
DROP COLUMN "exclu",
DROP COLUMN "inclu",
DROP COLUMN "location",
DROP COLUMN "startDate",
ADD COLUMN     "exclus" TEXT,
ADD COLUMN     "inclus" TEXT;
