-- CreateEnum
CREATE TYPE "RevalidationAction" AS ENUM ('revalidate', 'update');

-- CreateTable
CREATE TABLE "RevalidationStatus" (
    "id" SERIAL NOT NULL,
    "action" "RevalidationAction" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RevalidationStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RevalidationStatus_action_key" ON "RevalidationStatus"("action");
