import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const partnerSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().url().optional(),
  website: z.string().url().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional(),
  status: z.enum(["ACTIVE", "PAST", "PROSPECTIVE"]).default("PROSPECTIVE"),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = partnerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const partner = await prisma.partner.create({ data: parsed.data });
  return NextResponse.json(partner);
}

export async function PATCH(req: NextRequest) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, ...rest } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing partner id" }, { status: 400 });
  }

  const parsed = partnerSchema.partial().safeParse(rest);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const partner = await prisma.partner.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(partner);
}
