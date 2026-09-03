import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const inquirySchema = z.object({
  type: z.enum(["PARTNER", "IN_KIND", "VOLUNTEER"]),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  organizationName: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = inquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please fill out all required fields correctly." },
      { status: 400 }
    );
  }

  await prisma.inquiry.create({ data: parsed.data });

  return NextResponse.json({ success: true });
}