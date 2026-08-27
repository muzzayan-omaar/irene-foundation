import prisma from "@/lib/prisma";

export async function getSupporterCount() {
  const [donorCount, subscriberCount] = await Promise.all([
    prisma.donor.count(),
    prisma.newsletterSubscriber.count(),
  ]);

  // Simple sum for now — donors and subscribers may overlap (same person, same
  // email, both categories), so this is a "supporter touchpoints" figure, not
  // a strict unique-people count. Fine for a growth-feel number; worth revisiting
  // with proper deduplication once volume is real.
  return donorCount + subscriberCount;
}