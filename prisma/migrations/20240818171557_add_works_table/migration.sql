-- CreateTable
CREATE TABLE "Works" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'film',
    "date" TEXT NOT NULL DEFAULT 'no-date',
    "thumbnailLink" VARCHAR(1000) NOT NULL DEFAULT 'no-link',
    "animationThumbnailLink" VARCHAR(1000) NOT NULL DEFAULT 'no-link',
    "resourceId" TEXT NOT NULL,

    CONSTRAINT "Works_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Works_resourceId_key" ON "Works"("resourceId");
