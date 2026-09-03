import prisma from "@/lib/prisma";

export async function getSupporterCount() {
  // Pull just emails from each source, then dedupe with a Set — this fixes
  // the earlier double-counting issue (same person donating AND subscribing)
  // and folds in Volunteer/Partner inquiries so the number actually reflects
  // everyone the "join the movement" CTA invites, not just donors/subscribers.
  const [donors, subscribers, inquiries] = await Promise.all([
    prisma.donor.findMany({ select: { email: true } }),
    prisma.newsletterSubscriber.findMany({ select: { email: true } }),
    prisma.inquiry.findMany({
      where: { type: { in: ["VOLUNTEER", "PARTNER"] } },
      select: { email: true },
    }),
  ]);

  const uniqueEmails = new Set([
    ...donors.map((d) => d.email),
    ...subscribers.map((s) => s.email),
    ...inquiries.map((i) => i.email),
  ]);

  return uniqueEmails.size;
}

// For the Transparency page — a real classified breakdown, separate from
// the single homepage number, since detail belongs there, not on the homepage.
export async function getSupporterBreakdown() {
  const [donorCount, subscriberCount, volunteerCount, partnerCount] =
    await Promise.all([
      prisma.donor.count(),
      prisma.newsletterSubscriber.count(),
      prisma.inquiry.count({ where: { type: "VOLUNTEER" } }),
      prisma.inquiry.count({ where: { type: "PARTNER" } }),
    ]);

  return { donorCount, subscriberCount, volunteerCount, partnerCount };
}