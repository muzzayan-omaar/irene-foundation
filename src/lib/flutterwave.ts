const FLW_BASE_URL = "https://api.flutterwave.com/v3";

type InitiatePaymentParams = {
  txRef: string;
  amount: number;
  currency: string;
  redirectUrl: string;
  customer: {
    email: string;
    name: string;
    phone?: string;
  };
  meta?: Record<string, string>;
};

export async function initiatePayment(params: InitiatePaymentParams) {
  const res = await fetch(`${FLW_BASE_URL}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: params.txRef,
      amount: params.amount,
      currency: params.currency,
      redirect_url: params.redirectUrl,
      customer: {
        email: params.customer.email,
        name: params.customer.name,
        phonenumber: params.customer.phone,
      },
      customizations: {
        title: "Irene Namatovu Foundation",
        description: "Support our mission",
      },
      meta: params.meta,
    }),
  });

  const data = await res.json();

  if (data.status !== "success") {
    throw new Error(data.message || "Failed to initiate Flutterwave payment");
  }

  // data.data.link is the hosted checkout URL to redirect the donor to
  return data.data.link as string;
}

export async function verifyTransaction(transactionId: string) {
  const res = await fetch(
    `${FLW_BASE_URL}/transactions/${transactionId}/verify`,
    {
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      },
    }
  );

  const data = await res.json();
  return data;
}