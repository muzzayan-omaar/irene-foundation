import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { initiatePayment } from "@/lib/flutterwave";
import { donateSchema } from "@/lib/schemas/donate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = donateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Find or create the donor by email — repeat donors get matched, not duplicated
    const donor = await prisma.donor.upsert({
      where: { email: data.email },
      update: {
        fullName: data.fullName,
        phone: data.phone,
        country: data.country,
      },
      create: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        country: data.country,
      },
    });

    // Create the donation as PENDING — the webhook flips this once Flutterwave confirms payment
    const donation = await prisma.donation.create({
      data: {
        amount: data.amount,
        currency: data.currency,
        frequency: data.frequency,
        paymentMethod: "OTHER", // placeholder — webhook fills in the real method used
        message: data.message,
        isAnonymous: data.isAnonymous,
        donorId: donor.id,
        campaignId: data.campaignId,
      },
    });

    // donation.id doubles as the Flutterwave tx_ref — unique already, so the
    // webhook can look the donation straight back up with no extra field needed
    const checkoutLink = await initiatePayment({
      txRef: donation.id,
      amount: data.amount,
      currency: data.currency,
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/donate/success`,
      customer: {
        email: data.email,
        name: data.fullName,
        phone: data.phone,
      },
      meta: {
        donationId: donation.id,
        campaignId: data.campaignId ?? "",
      },
    });

    return NextResponse.json({ checkoutLink });
  } catch (err) {
    console.error("Donation initiation failed:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}