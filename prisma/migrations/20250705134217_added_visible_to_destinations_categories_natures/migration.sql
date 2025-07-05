-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "visible" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Destination" ADD COLUMN     "visible" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Nature" ADD COLUMN     "visible" BOOLEAN NOT NULL DEFAULT true;
