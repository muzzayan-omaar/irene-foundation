import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

// ⚠️ TEMPORARY — NO AUTHENTICATION YET. Same caveat as other /api/admin routes.

const pressMentionSchema = z.object({
  outletName: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url(),
  logoUrl: z.string().url().optional(),
  publishedDate: z.coerce.date().optional(),
});

export async function POST(req: NextRequest) {
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