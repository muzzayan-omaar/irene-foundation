import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyTransaction } from "@/lib/flutterwave";

type PaymentMethodEnum =
  | "CARD"
  | "MOBILE_MONEY_MTN"
  | "MOBILE_MONEY_AIRTEL"
  | "BANK_TRANSFER"
  | "OTHER";

function mapPaymentMethod(paymentType: string | undefined): PaymentMethodEnum {
  const type = paymentType?.toLowerCase() ?? "";
  if (type.includes("card")) return "CARD";
  if (type.includes("mtn")) return "MOBILE_MONEY_MTN";
  if (type.includes("airtel")) return "MOBILE_MONEY_AIRTEL";
  if (type.includes("mobilemoney")) return "MOBILE_MONEY_MTN"; // best-effort default when network isn't split out
  if (type.includes("bank") || type.includes("account")) return "BANK_TRANSFER";
  return "OTHER";
}

export async function POST(req: NextRequest) {
  // 1. Verify this request actually came from Flutterwave
  const signature = req.headers.get("verif-hash");

  if (!signature || signature !== process.env.FLUTTERWAVE_WEBHOOK_HASH) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = await req.json();
  const { event, data } = payload;

  if (event !== "charge.completed") {
    // Not a payment event we care about — acknowledge and ignore
    return NextResponse.json({ received: true });
  }

  const donationId = data.tx_ref; // we set tx_ref = donation.id when initiating payment

  try {
    // 2. Never trust the webhook body alone — re-verify the transaction directly
    // with Flutterwave's API. This protects against spoofed webhook calls.
    const verification = await verifyTransaction(data.id);
    const verifiedData = verification?.data;

    const isGenuinelySuccessful =
      verifiedData &&
      verifiedData.status === "successful" &&
      verifiedData.tx_ref === donationId;

    if (!isGenuinelySuccessful) {
      await prisma.donation.update({
        where: { id: donationId },
        data: { status: "FAILED" },
      });
      return NextResponse.json({ received: true });
    }

    await prisma.donation.update({
      where: { id: donationId },
      data: {
        status: "SUCCESSFUL",
        flutterwaveTxId: String(verifiedData.id),
        paymentMethod: mapPaymentMethod(verifiedData.payment_type),
      },
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook processing failed for donation:", donationId, err);
    // Still return 200 so Flutterwave doesn't hammer this endpoint with retries —
    // but the console.error above is what tells you a donation may be stuck PENDING
    return NextResponse.json({ received: true });
  }
}