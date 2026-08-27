-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('INSTAGRAM', 'TWITTER', 'FACEBOOK', 'TIKTOK', 'OTHER');

-- CreateTable
CREATE TABLE "SupportPost" (
    "id" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL DEFAULT 'OTHER',
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "sourceUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SupportPost_isFeatured_idx" ON "SupportPost"("isFeatured");
