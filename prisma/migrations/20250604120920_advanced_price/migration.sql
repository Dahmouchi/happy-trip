/*
  Warnings:

  - The values [EN_MESURE] on the enum `DestinaionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `weekendsOnly` on the `Tour` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DestinaionType_new" AS ENUM ('NATIONAL', 'INTERNATIONAL');
ALTER TABLE "Destination" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Destination" ALTER COLUMN "type" TYPE "DestinaionType_new" USING ("type"::text::"DestinaionType_new");
ALTER TYPE "DestinaionType" RENAME TO "DestinaionType_old";
ALTER TYPE "DestinaionType_new" RENAME TO "DestinaionType";
DROP TYPE "DestinaionType_old";
ALTER TABLE "Destination" ALTER COLUMN "type" SET DEFAULT 'NATIONAL';
COMMIT;

-- AlterTable
ALTER TABLE "Tour" DROP COLUMN "weekendsOnly";
