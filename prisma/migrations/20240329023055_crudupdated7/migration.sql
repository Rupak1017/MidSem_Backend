-- CreateTable
CREATE TABLE "footballs" (
    "id" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "club" TEXT NOT NULL,
    "position" TEXT NOT NULL,

    CONSTRAINT "footballs_pkey" PRIMARY KEY ("id")
);
