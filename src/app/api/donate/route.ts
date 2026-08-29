import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { donateSchema } from "@/lib/schemas/donate";

// PAYMENT GATEWAY: frozen pending KYC/registration — swap this for a real
// gateway module (flutterwave.ts / paystack.ts / dpo.ts) once confirmed.
type InitiatePaymentArgs = {
  reference: string;
  amount: number;
  currency: string;
  callbackUrl: string;
  email: string;
  metadata: {
    donationId: string;
    campaignId: string;
  };
};

function initiatePayment(_args: InitiatePaymentArgs): Promise<string> {
  throw new Error(
    "Payment gateway not yet configured — donation flow is paused pending Flutterwave/Paystack/DPO account setup."
  );
}

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

    const donation = await prisma.donation.create({
      data: {
        amount: data.amount,
        currency: data.currency,
        frequency: data.frequency,
        paymentMethod: "OTHER",
        message: data.message,
        isAnonymous: data.isAnonymous,
        donorId: donor.id,
        campaignId: data.campaignId,
      },
    });

    const checkoutLink = await initiatePayment({
      reference: donation.id,
      amount: data.amount,
      currency: data.currency,
      callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/donate/success`,
      email: data.email,
      metadata: {
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