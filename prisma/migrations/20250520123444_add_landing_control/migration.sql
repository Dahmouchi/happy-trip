/*
  Warnings:

  - The values [ANALYSTE,RESPONSABLE,ADMIN_RESPONSABLE] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Alert` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AlertChat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AlertHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Conclusion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FileJustif` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Persons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TravelType" AS ENUM ('NATIONAL', 'INTERNATIONAL', 'EN_MESURE');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('USER', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_assignedAnalystId_fkey";

-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_assignedResponsableId_fkey";

-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_createdById_fkey";

-- DropForeignKey
ALTER TABLE "AlertChat" DROP CONSTRAINT "AlertChat_alertId_fkey";

-- DropForeignKey
ALTER TABLE "AlertHistory" DROP CONSTRAINT "AlertHistory_alertId_fkey";

-- DropForeignKey
ALTER TABLE "AlertHistory" DROP CONSTRAINT "AlertHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_chatId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Conclusion" DROP CONSTRAINT "Conclusion_alertId_fkey";

-- DropForeignKey
ALTER TABLE "Conclusion" DROP CONSTRAINT "Conclusion_createdById_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_alertId_fkey";

-- DropForeignKey
ALTER TABLE "FileJustif" DROP CONSTRAINT "FileJustif_justifId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Persons" DROP CONSTRAINT "Persons_codeAlert_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropTable
DROP TABLE "Alert";

-- DropTable
DROP TABLE "AlertChat";

-- DropTable
DROP TABLE "AlertHistory";

-- DropTable
DROP TABLE "ChatMessage";

-- DropTable
DROP TABLE "Conclusion";

-- DropTable
DROP TABLE "File";

-- DropTable
DROP TABLE "FileJustif";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "Persons";

-- DropTable
DROP TABLE "Profile";

-- DropEnum
DROP TYPE "AdminAlertStatus";

-- DropEnum
DROP TYPE "AlertStatus";

-- DropEnum
DROP TYPE "ContactPreference";

-- DropEnum
DROP TYPE "RecevalbeStatus";

-- DropEnum
DROP TYPE "UserAlertStatus";

-- CreateTable
CREATE TABLE "Landing" (
    "id" TEXT NOT NULL,
    "navbar" BOOLEAN NOT NULL DEFAULT true,
    "hero" BOOLEAN NOT NULL DEFAULT true,
    "national" BOOLEAN NOT NULL DEFAULT true,
    "international" BOOLEAN NOT NULL DEFAULT true,
    "mesure" BOOLEAN NOT NULL DEFAULT true,
    "reviews" BOOLEAN NOT NULL DEFAULT true,
    "meeting" BOOLEAN NOT NULL DEFAULT true,
    "expert" BOOLEAN NOT NULL DEFAULT true,
    "trust" BOOLEAN NOT NULL DEFAULT true,
    "footer" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Landing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tour" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "TravelType" NOT NULL DEFAULT 'NATIONAL',
    "location" TEXT,
    "priceOriginal" INTEGER,
    "priceDiscounted" INTEGER,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "durationDays" INTEGER,
    "durationNights" INTEGER,
    "accommodation" TEXT,
    "imageUrl" TEXT,
    "groupType" TEXT,
    "groupSizeMax" INTEGER,
    "showReviews" BOOLEAN NOT NULL DEFAULT true,
    "showDifficulty" BOOLEAN NOT NULL DEFAULT true,
    "showDiscount" BOOLEAN NOT NULL DEFAULT true,
    "difficultyLevel" INTEGER,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "discountPercent" INTEGER,
    "weekendsOnly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VacationStyle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "VacationStyle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourDate" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TourDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TourVacationStyles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TourVacationStyles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "VacationStyle_name_key" ON "VacationStyle"("name");

-- CreateIndex
CREATE INDEX "_TourVacationStyles_B_index" ON "_TourVacationStyles"("B");

-- AddForeignKey
ALTER TABLE "TourDate" ADD CONSTRAINT "TourDate_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TourVacationStyles" ADD CONSTRAINT "_TourVacationStyles_A_fkey" FOREIGN KEY ("A") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TourVacationStyles" ADD CONSTRAINT "_TourVacationStyles_B_fkey" FOREIGN KEY ("B") REFERENCES "VacationStyle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
