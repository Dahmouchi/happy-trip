/*
  Warnings:

  - You are about to drop the column `priceAdvance` on the `Tour` table. All the data in the column will be lost.
  - You are about to alter the column `priceOriginal` on the `Tour` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `priceDiscounted` on the `Tour` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Tour" DROP COLUMN "priceAdvance",
ADD COLUMN     "advancedPrice" INTEGER,
ALTER COLUMN "priceOriginal" SET DATA TYPE INTEGER,
ALTER COLUMN "priceDiscounted" SET DATA TYPE INTEGER;
