"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { donateSchema, type DonateFormInput, type DonateInput } from "@/lib/schemas/donate";

const PRESET_AMOUNTS = [10, 25, 50, 100];

export default function DonateForm({ campaignId }: { campaignId?: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DonateFormInput>({
    resolver: zodResolver(donateSchema),
    defaultValues: {
      currency: "USD",
      frequency: "ONE_TIME",
      isAnonymous: false,
      campaignId,
    },
  });

  const selectedAmount = watch("amount");
  const frequency = watch("frequency");

  async function onSubmit(data: DonateInput) {
    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      // Send the donor to Flutterwave's hosted checkout
      window.location.href = result.checkoutLink;
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong"
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md w-full space-y-6">
      {/* Frequency toggle */}
      <div className="flex rounded-lg overflow-hidden border border-gray-200">
        <button
          type="button"
          onClick={() => setValue("frequency", "ONE_TIME")}
          className={`flex-1 py-2 text-sm font-medium ${
            frequency === "ONE_TIME"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-600"
          }`}
        >
          Give Once
        </button>
        <button
          type="button"
          onClick={() => setValue("frequency", "MONTHLY")}
          className={`flex-1 py-2 text-sm font-medium ${
            frequency === "MONTHLY"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-600"
          }`}
        >
          Give Monthly
        </button>
      </div>

      {/* Amount presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount (USD)
        </label>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setValue("amount", amt)}
              className={`py-2 rounded-md border text-sm font-medium ${
                selectedAmount === amt
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 text-gray-700"
              }`}
            >
              ${amt}
            </button>
          ))}
        </div>
        <input
          type="number"
          step="0.01"
          placeholder="Custom amount"
          {...register("amount")}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />
        {errors.amount && (
          <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
        )}
      </div>

      {/* Donor details */}
      <div className="space-y-3">
        <div>
          <input
            type="text"
            placeholder="Full name"
            {...register("fullName")}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <input
          type="tel"
          placeholder="Phone (optional, needed for Mobile Money)"
          {...register("phone")}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />

        <input
          type="text"
          placeholder="Country (optional)"
          {...register("country")}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />

        <textarea
          placeholder="Leave a message of support (optional)"
          {...register("message")}
          rows={3}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        />

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" {...register("isAnonymous")} />
          Give anonymously
        </label>
      </div>

      {serverError && (
        <p className="text-red-500 text-sm">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gray-900 text-white py-3 rounded-md font-medium disabled:opacity-50"
      >
        {submitting ? "Redirecting to checkout..." : "Donate Now"}
      </button>
    </form>
  );
}