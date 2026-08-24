-- CreateTable
CREATE TABLE "Simulation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Répétition de soutenance',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "durationSec" INTEGER NOT NULL DEFAULT 120,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "videoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Simulation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Simulation_userId_createdAt_idx" ON "Simulation"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "Simulation" ADD CONSTRAINT "Simulation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
