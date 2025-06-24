-- CreateTable
CREATE TABLE "NewsLetter" (
    "id" TEXT NOT NULL,
    "nom" TEXT,
    "prenom" TEXT,
    "email" TEXT,
    "message" TEXT,
    "statu" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NewsLetter_pkey" PRIMARY KEY ("id")
);
