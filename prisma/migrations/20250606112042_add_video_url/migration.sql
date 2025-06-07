-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "videoUrl" TEXT;

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TourServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TourServices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_key" ON "Service"("name");

-- CreateIndex
CREATE INDEX "_TourServices_B_index" ON "_TourServices"("B");

-- AddForeignKey
ALTER TABLE "_TourServices" ADD CONSTRAINT "_TourServices_A_fkey" FOREIGN KEY ("A") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TourServices" ADD CONSTRAINT "_TourServices_B_fkey" FOREIGN KEY ("B") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
