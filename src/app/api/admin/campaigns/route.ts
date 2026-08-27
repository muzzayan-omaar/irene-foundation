import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

// ⚠️ TEMPORARY — NO AUTHENTICATION ON THIS ROUTE YET.
// This exists purely so campaigns can be created/edited during Phase 2
// development before the real admin dashboard (Phase 5, Supabase Auth-gated)
// exists. Do NOT expose this to the public internet without auth in front of it.

const campaignSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  story: z.string().min(10),
  coverImage: z.string().url().optional(),
  goalAmount: z.coerce.number().positive(),
  currency: z.string().default("USD"),
  status: z.enum(["DRAFT", "ACTIVE", "COMPLETED", "PAUSED"]).default("DRAFT"),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = campaignSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const campaign = await prisma.campaign.create({ data: parsed.data });
  return NextResponse.json(campaign);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...rest } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing campaign id" }, { status: 400 });
  }

  const parsed = campaignSchema.partial().safeParse(rest);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const campaign = await prisma.campaign.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(campaign);
}