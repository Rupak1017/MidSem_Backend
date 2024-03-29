-- CreateTable
CREATE TABLE "PlayerStats" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "goals" INTEGER,
    "assists" INTEGER,
    "yellowCards" INTEGER,
    "redCards" INTEGER,

    CONSTRAINT "PlayerStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerStats_playerId_key" ON "PlayerStats"("playerId");

-- AddForeignKey
ALTER TABLE "PlayerStats" ADD CONSTRAINT "PlayerStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "footballs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
