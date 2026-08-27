import prisma from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

export default async function DonationSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ tx_ref?: string; status?: string }>;
}) {
  const params = await searchParams;
  const donationId = params.tx_ref;

  const donation = donationId
    ? await prisma.donation.findUnique({
        where: { id: donationId },
        include: { donor: true, campaign: true },
      })
    : null;

  // Flutterwave's own redirect status param — useful as an instant hint,
  // but donation.status (set by the webhook) is the source of truth
  const flutterwaveStatus = params.status;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        {donation?.status === "SUCCESSFUL" && (
          <>
            <CheckCircle2 className="mx-auto text-green-600" size={56} />
            <h1 className="text-2xl font-semibold">Thank you{donation.isAnonymous ? "" : `, ${donation.donor.fullName}`}!</h1>
            <p className="text-gray-600">
              Your gift of {donation.currency} {donation.amount.toString()}
              {donation.campaign ? ` to "${donation.campaign.title}"` : ""} has
              been received. It's already making a difference.
            </p>
          </>
        )}

        {donation?.status === "PENDING" && (
          <>
            <Clock className="mx-auto text-amber-500" size={56} />
            <h1 className="text-2xl font-semibold">Confirming your donation...</h1>
            <p className="text-gray-600">
              Your payment is being verified. This page will usually update
              within a minute — if you don't see confirmation shortly, check
              your email or contact us and we'll sort it out.
            </p>
          </>
        )}

        {donation?.status === "FAILED" && (
          <>
            <XCircle className="mx-auto text-red-500" size={56} />
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="text-gray-600">
              Your payment didn't go through, and you have not been charged.
              Please try again, or reach out if the problem continues.
            </p>
          </>
        )}

        {!donation && flutterwaveStatus === "cancelled" && (
          <>
            <XCircle className="mx-auto text-gray-400" size={56} />
            <h1 className="text-2xl font-semibold">Donation cancelled</h1>
            <p className="text-gray-600">
              No worries — nothing was charged. You can try again anytime.
            </p>
          </>
        )}

        {!donation && flutterwaveStatus !== "cancelled" && (
          <>
            <XCircle className="mx-auto text-gray-400" size={56} />
            <h1 className="text-2xl font-semibold">We couldn't find that donation</h1>
            <p className="text-gray-600">
              If you completed a payment, please contact us with your email so
              we can confirm it on our end.
            </p>
          </>
        )}

        <Link
          href="/"
          className="inline-block mt-4 text-sm font-medium underline text-gray-700"
        >
          Return to homepage
        </Link>
      </div>
    </div>
  );
}