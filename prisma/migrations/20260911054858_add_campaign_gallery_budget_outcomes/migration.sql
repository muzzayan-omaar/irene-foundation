-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "budgetBreakdown" JSONB,
ADD COLUMN     "galleryImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "outcomes" TEXT,
ADD COLUMN     "videoUrl" TEXT;
