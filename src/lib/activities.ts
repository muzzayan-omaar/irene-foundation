import prisma from "@/lib/prisma";

export type ActivityTypeFilter = "UPDATE" | "PHOTO_STORY" | "VIDEO" | "POD" | "ALL";

export async function listPublishedActivities(type: ActivityTypeFilter = "ALL") {
  return prisma.activity.findMany({
    where: {
      isPublished: true,
      ...(type !== "ALL" ? { type } : {}),
    },
    include: {
      campaign: { select: { title: true, slug: true } },
    },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getActivityBySlug(slug: string) {
  return prisma.activity.findUnique({
    where: { slug },
    include: {
      campaign: { select: { title: true, slug: true } },
      author: { select: { fullName: true } },
    },
  });
}
