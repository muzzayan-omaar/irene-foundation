import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

// ⚠️ TEMPORARY — NO AUTHENTICATION YET. Same caveat as other /api/admin routes.

const supportPostSchema = z.object({
  authorName: z.string().min(1),
  platform: z.enum(["INSTAGRAM", "TWITTER", "FACEBOOK", "TIKTOK", "OTHER"]).default("OTHER"),
  content: z.string().min(1),
  imageUrl: z.string().url().optional(),
  sourceUrl: z.string().url().optional(),
  isFeatured: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = supportPostSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const post = await prisma.supportPost.create({ data: parsed.data });
  return NextResponse.json(post);
}