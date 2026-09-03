import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes = [
    "",
    "/campaigns",
    "/field-notes",
    "/get-involved",
    "/wall-of-support",
    "/about",
    "/press",
    "/transparency",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  const [campaigns, activities] = await Promise.all([
    prisma.campaign.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.activity.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const campaignRoutes = campaigns.map((c) => ({
    url: `${baseUrl}/campaigns/${c.slug}`,
    lastModified: c.updatedAt,
  }));

  const activityRoutes = activities.map((a) => ({
    url: `${baseUrl}/field-notes/${a.slug}`,
    lastModified: a.updatedAt,
  }));

  return [...staticRoutes, ...campaignRoutes, ...activityRoutes];
}
