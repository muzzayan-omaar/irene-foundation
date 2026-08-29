import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const pressMentionSchema = z.object({
  outletName: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url(),
  logoUrl: z.string().url().optional(),
  publishedDate: z.coerce.date().optional(),
});

export async function POST(req: NextRequest) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = pressMentionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const mention = await prisma.pressMention.create({ data: parsed.data });
  return NextResponse.json(mention);
}

export async function PATCH(req: NextRequest) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, ...rest } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing mention id" }, { status: 400 });
  }

  const parsed = pressMentionSchema.partial().safeParse(rest);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const mention = await prisma.pressMention.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(mention);
}