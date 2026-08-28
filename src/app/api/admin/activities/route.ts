import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const activitySchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  type: z.enum(["UPDATE", "PHOTO_STORY", "VIDEO", "POD"]),
  body: z.string().min(10),
  mediaUrls: z.array(z.string().url()).default([]),
  campaignId: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = activitySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const activity = await prisma.activity.create({
    data: {
      ...parsed.data,
      publishedAt: parsed.data.isPublished ? new Date() : null,
    },
  });

  return NextResponse.json(activity);
}

export async function PATCH(req: NextRequest) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, ...rest } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing activity id" }, { status: 400 });
  }

  const parsed = activitySchema.partial().safeParse(rest);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const activity = await prisma.activity.update({
    where: { id },
    data: {
      ...parsed.data,
      ...(parsed.data.isPublished ? { publishedAt: new Date() } : {}),
    },
  });

  return NextResponse.json(activity);
}