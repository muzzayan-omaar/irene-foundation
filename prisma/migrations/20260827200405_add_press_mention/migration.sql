-- CreateTable
CREATE TABLE "PressMention" (
    "id" TEXT NOT NULL,
    "outletName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "logoUrl" TEXT,
    "publishedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PressMention_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PressMention_publishedDate_idx" ON "PressMention"("publishedDate");
