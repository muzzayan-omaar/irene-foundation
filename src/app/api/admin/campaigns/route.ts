import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const campaignSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  story: z.string().min(10),
  coverImage: z.string().url().optional(),
  galleryImages: z.array(z.string().url()).default([]),
  videoUrl: z.string().url().optional(),
  budgetBreakdown: z
    .array(z.object({ label: z.string().min(1), amount: z.coerce.number() }))
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

  try {
    const campaign = await prisma.campaign.create({ data: parsed.data });
    return NextResponse.json(campaign);
  } catch (err: unknown) {
    console.error("Failed to create campaign:", err);
    return NextResponse.json(
      { error: "Something went wrong saving this campaign. Check server logs." },
      { status: 500 }
    );
  }
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

  try {
    const campaign = await prisma.campaign.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json(campaign);
  } catch (err: unknown) {
    console.error("Failed to update campaign:", err);
    return NextResponse.json(
      { error: "Something went wrong saving this campaign. Check server logs." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing campaign id" }, { status: 400 });
  }

  try {
    await prisma.campaign.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    // P2003 = foreign key constraint failed — this campaign has real
    // donations (or activities) pointing to it, so deleting it would break
    // that history. Tell the admin clearly instead of a raw DB error.
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "P2003"
    ) {
      return NextResponse.json(
        {
          error:
            "Can't delete — this campaign has donations or activities recorded against it. Set its status to Paused or Completed instead.",
        },
        { status: 409 }
      );
    }
    throw err;
  }
}