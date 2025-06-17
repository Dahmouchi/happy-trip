/*
  Warnings:

  - You are about to drop the column `userId` on the `reservation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "reservation" DROP CONSTRAINT "reservation_userId_fkey";

-- AlterTable
ALTER TABLE "reservation" DROP COLUMN "userId";
