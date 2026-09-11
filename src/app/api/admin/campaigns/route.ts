import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const emptyToUndefined = z
  .string()
  .optional()
  .transform((v) => (v === "" ? undefined : v));

const campaignSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  story: z.string().min(10),
  coverImage: emptyToUndefined.pipe(z.string().url().optional()),
  galleryImages: z.array(z.string().url()).default([]),
  videoUrl: emptyToUndefined.pipe(z.string().url().optional()),
  budgetBreakdown: z
    .array(
      z.object({
        label: z.string().min(1),
        amount: z.coerce.number(),
      })
    )
    .optional(),
  outcomes: z.string().optional(),
  goalAmount: z.coerce.number().positive(),
  currency: z.string().default("USD"),
  status: z.enum(["DRAFT", "ACTIVE", "COMPLETED", "PAUSED"]).default("DRAFT"),
});

export async function POST(req: NextRequest) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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